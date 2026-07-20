// src/app/api/webhooks/stripe/route.js
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  const body = await req.text(); // raw body zaroori hai signature verify karne ke liye
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      orderStatus: "processing",
    });

    console.log("✅ Order marked as paid:", orderId);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}