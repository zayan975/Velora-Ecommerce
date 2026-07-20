// services/cartService.js
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export const getCartService = async (userId) => {
  await connectDB();
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name images price stock"
  );
  return cart || { user: userId, items: [] };
};

export const addToCartService = async (userId, { productId, quantity = 1, size = "", color = "" }) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity, price: product.price, size, color }],
    });
    return cart;
  }

  // same product + size + color already cart mein hai to quantity increase karo
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price, size, color });
  }

  await cart.save();
  return cart;
};

export const updateCartQuantityService = async (userId, { productId, quantity, size = "", color = "" }) => {
  if (quantity < 1) throw new Error("Quantity must be at least 1");

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
  );

  if (!item) throw new Error("Item not found in cart");

  item.quantity = quantity;
  await cart.save();
  return cart;
};

export const removeCartItemService = async (userId, { productId, size = "", color = "" }) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
      )
  );

  await cart.save();
  return cart;
};

export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = [];
  await cart.save();
  return cart;
};