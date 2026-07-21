// src/controllers/orderController.js
import { NextResponse } from "next/server";
import { createOrderService } from "@/features/order/services/order.service";
import {
  getMyOrdersService,
  getOrderDetailsService,
  getAllOrdersService,
  updateOrderStatusService,
  updatePaymentStatusService
} from "@/features/order/services/order.service"

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

export const getMyOrdersController = async (req, userId) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const result = await getMyOrdersService(userId, { page, limit });
    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};


export const getOrderDetailsController = async (userId, userRole, orderId) => {
  try {
    const order = await getOrderDetailsService(userId, userRole, orderId);
    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    const status = error.message.includes("Not authorized") ? 403 : 404;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
};

export const getAllOrdersController = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const status = searchParams.get("status") || undefined;

    const result = await getAllOrdersService({ page, limit, status });
    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const updateOrderStatusController = async (req, orderId) => {
  try {
    const body = await req.json();
    const { status } = body;

    const order = await updateOrderStatusService(orderId, status);
    return NextResponse.json(
      { success: true, message: "Order status updated.", data: order },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

export const updatePaymentStatusController = async (req, orderId) => {
  try {
    const body = await req.json();
    const { paymentStatus } = body;

    const order = await updatePaymentStatusService(orderId, paymentStatus);
    return NextResponse.json(
      { success: true, message: "Payment status updated.", data: order },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};