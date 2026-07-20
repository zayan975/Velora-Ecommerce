// src/controllers/checkoutController.js
import { NextResponse } from "next/server";
import { checkoutSummaryService } from "@/features/checkout/services/checkout.services";

export const checkoutSummaryController = async (userId) => {
  try {
    const summary = await checkoutSummaryService(userId);
    return NextResponse.json({ success: true, data: summary }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
};