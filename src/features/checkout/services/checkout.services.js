// src/services/checkout.service.js
import connectDB from "@/lib/db";
import { getPopulatedCart } from "@/features/checkout/repositories/checkout.repository";

const SHIPPING_FLAT_RATE = 200; // yahan apni logic daal sakte ho (free above X, etc.)

export const checkoutSummaryService = async (userId) => {
  await connectDB();

  const cart = await getPopulatedCart(userId);

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Stock validation — checkout se pehle zaroori hai
  for (const item of cart.items) {
    if (!item.product) {
      throw new Error("One of the products in your cart no longer exists");
    }
    if (item.product.stock < item.quantity) {
      throw new Error(`${item.product.name} has insufficient stock`);
    }
  }

  // Subtotal — cart mein saved price (snapshot) use karna hai, live product.price nahi
  // taake price change hone pe cart mismatch na ho
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? SHIPPING_FLAT_RATE : 0;

  const discount = 0; // TODO: coupon/promo logic future mein
  const tax = 0; // TODO: tax calculation future mein

  const total = subtotal + shipping - discount + tax;

  return {
    items: cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      quantity: item.quantity,
      price: item.price,
      lineTotal: item.price * item.quantity,
    })),
    subtotal,
    shipping,
    discount,
    tax,
    total,
  };
};