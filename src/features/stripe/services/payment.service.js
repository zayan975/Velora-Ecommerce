// src/services/payment.service.js
import connectDB from "@/lib/db";
import stripe from "@/lib/stripe";
import Order from "@/models/Order";

export const createCheckoutSessionService = async (userId, orderId) => {
  await connectDB();

  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) throw new Error("Order not found");
  if (order.paymentStatus === "paid") throw new Error("Order already paid");

  const line_items = order.items.map((item) => ({
    price_data: {
      currency: "pkr", // apni currency daal do (usd/pkr/etc)
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100), // Stripe cents/paisa mein leta hai
    },
    quantity: item.quantity,
  }));

  // Shipping ko bhi ek line item ki tarah add karna (simplest approach)
  if (order.shipping > 0) {
    line_items.push({
      price_data: {
        currency: "pkr",
        product_data: { name: "Shipping" },
        unit_amount: Math.round(order.shipping * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url: `${process.env.NEXTAUTH_URL}/orders/${order._id}?payment=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/orders/${order._id}?payment=cancelled`,
    metadata: {
      orderId: order._id.toString(),
      userId: userId.toString(),
    },
  });

  return session.url;
};