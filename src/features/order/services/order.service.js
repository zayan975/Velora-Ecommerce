// src/services/order.service.js
import connectDB from "@/lib/db";
import { getPopulatedCart } from "@/features/checkout/repositories/checkout.repository";
import {
  createOrderRecord,
  decrementStock,
  clearUserCart,
} from "@/features/order/repositories/order.repository";
import User from "@/models/User";
import { sendOrderConfirmationEmail } from "@/features/email/services/email.service";
import {
  findMyOrders,
  findOrderById,
  findAllOrders,
  updateOrderStatusRecord,
  updatePaymentStatusRecord
} from "@/features/order/repositories/order.repository";
import { sendOrderStatusEmail } from "@/features/email/services/email.service"

const SHIPPING_FLAT_RATE = 200;

export const createOrderService = async (
  userId,
  { shippingAddress, paymentMethod = "cod" },
) => {
  await connectDB();

  if (
    !shippingAddress?.fullName ||
    !shippingAddress?.phone ||
    !shippingAddress?.addressLine ||
    !shippingAddress?.city
  ) {
    throw new Error("Shipping address is incomplete");
  }

  const cart = await getPopulatedCart(userId);

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Step 1: Stock validate + decrement atomically, ek ek item karke
  const decrementedItems = []; // rollback ke liye track karna, agar beech mein koi fail ho

  for (const item of cart.items) {
    if (!item.product) {
      throw new Error("One of the products in your cart no longer exists");
    }

    const updatedProduct = await decrementStock(
      item.product._id,
      item.quantity,
    );

    if (!updatedProduct) {
      // Rollback: jo items already decrement ho chuke hain unko wapas add karo
      for (const done of decrementedItems) {
        await decrementStock(done.product, -done.quantity); // negative quantity se wapas add
      }
      throw new Error(`${item.product.name} is out of stock`);
    }

    decrementedItems.push({
      product: item.product._id,
      quantity: item.quantity,
    });
  }

  // Step 2: Pricing calculate (checkout jaisa hi)
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? SHIPPING_FLAT_RATE : 0;
  const discount = 0;
  const tax = 0;
  const total = subtotal + shipping - discount + tax;

  // Step 3: Order create karo
  const order = await createOrderRecord({
    user: userId,
    items: cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      quantity: item.quantity,
      price: item.price,
    })),
    shippingAddress,
    subtotal,
    shipping,
    discount,
    tax,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
  });

  // Step 4: Cart clear karo
  await clearUserCart(userId);

  const user = await User.findById(userId).select("email");
  if (user?.email) {
    await sendOrderConfirmationEmail(order, user.email);
  }

  return order;
};

export const getMyOrdersService = async (userId, { page = 1, limit = 10 }) => {
  await connectDB();

  const { orders, total } = await findMyOrders(userId, { page, limit });

  return {
    orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOrderDetailsService = async (userId, userRole, orderId) => {
  await connectDB();

  const order = await findOrderById(orderId);

  if (!order) throw new Error("Order not found");

  // Security: normal user sirf apna order dekh sake, admin kisi ka bhi
  if (userRole !== "admin" && order.user._id.toString() !== userId) {
    throw new Error("Not authorized to view this order");
  }

  return order;
};

export const getAllOrdersService = async ({ page = 1, limit = 10, status }) => {
  await connectDB();

  const { orders, total } = await findAllOrders({ page, limit, status });

  return {
    orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export const updateOrderStatusService = async (orderId, status) => {
  await connectDB();

  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const order = await updateOrderStatusRecord(orderId, status);

  if (!order) throw new Error("Order not found");

  // Email bhejo — order fail na ho email fail hone se, isliye try/catch pehle se function ke andar hai
  const user = await User.findById(order.user).select("email");
  if (user?.email) {
    await sendOrderStatusEmail(order, user.email);
  }

  return order;
};

const VALID_PAYMENT_STATUSES = ["pending", "paid", "failed"];

export const updatePaymentStatusService = async (orderId, paymentStatus) => {
  await connectDB();

  if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
    throw new Error(`Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(", ")}`);
  }

  const order = await updatePaymentStatusRecord(orderId, paymentStatus);
  if (!order) throw new Error("Order not found");

  return order;
};