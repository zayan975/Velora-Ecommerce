// src/controllers/orderController.js
import { NextResponse } from "next/server";
import { createOrderService } from "@/features/order/services/order.service";

export const createOrderController = async (req, userId) => {
  try {
    const body = await req.json();
    const { shippingAddress, paymentMethod } = body;

    const order = await createOrderService(userId, { shippingAddress, paymentMethod });

    return NextResponse.json(
      { success: true, message: "Order placed successfully.", data: order },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
};