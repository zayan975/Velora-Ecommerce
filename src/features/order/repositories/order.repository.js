// src/repositories/order.repository.js
import Order from "@/models/Order";
import Product from "@/models/Product";
import Cart from "@/models/Cart";

export const createOrderRecord = async (orderData) => {
  return Order.create(orderData);
};

// Atomic stock decrement — race condition safe
export const decrementStock = async (productId, quantity) => {
  return Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true }
  );
};

export const clearUserCart = async (userId) => {
  return Cart.findOneAndUpdate({ user: userId }, { items: [] });
};

export const findMyOrders = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ user: userId }),
  ]);

  return { orders, total };
};

export const findOrderById = async (orderId) => {
  return Order.findById(orderId).populate("user", "name email");
};

export const findAllOrders = async ({ page = 1, limit = 10, status }) => {
  const skip = (page - 1) * limit;
  const filter = status ? { orderStatus: status } : {};

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return { orders, total };
};

export const updateOrderStatusRecord = async (orderId, status) => {
  return Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
};

export const updatePaymentStatusRecord = async (orderId, paymentStatus) => {
  return Order.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
};