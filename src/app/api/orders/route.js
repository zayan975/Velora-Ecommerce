// src/app/api/orders/route.js
import { getAuthUser } from "@/lib/getAuthUser";
import { createOrderController } from "@/features/order/controllers/order.controller";

export async function POST(req) {
  const userId = await getAuthUser();
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return createOrderController(req, userId);
}