// src/controllers/paymentController.js
import { NextResponse } from "next/server";
import { createCheckoutSessionService } from "@/features/stripe/services/payment.service";

export const createCheckoutSessionController = async (userId, orderId) => {
  try {
    const url = await createCheckoutSessionService(userId, orderId);
    return NextResponse.json({ success: true, url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};