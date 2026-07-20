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