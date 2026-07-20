// src/services/order.service.js
import connectDB from "@/lib/db";
import { getPopulatedCart } from "@/features/checkout/repositories/checkout.repository";
import { createOrderRecord, decrementStock, clearUserCart } from "@/features/order/repositories/order.repository";

const SHIPPING_FLAT_RATE = 200;

export const createOrderService = async (userId, { shippingAddress, paymentMethod = "cod" }) => {
  await connectDB();

  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.addressLine || !shippingAddress?.city) {
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

    const updatedProduct = await decrementStock(item.product._id, item.quantity);

    if (!updatedProduct) {
      // Rollback: jo items already decrement ho chuke hain unko wapas add karo
      for (const done of decrementedItems) {
        await decrementStock(done.product, -done.quantity); // negative quantity se wapas add
      }
      throw new Error(`${item.product.name} is out of stock`);
    }

    decrementedItems.push({ product: item.product._id, quantity: item.quantity });
  }

  // Step 2: Pricing calculate (checkout jaisa hi)
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

  return order;
};