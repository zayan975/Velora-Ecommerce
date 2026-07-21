// src/app/api/orders/my/route.js
import { getAuthUser } from "@/lib/getAuthUser";
import { getMyOrdersController } from "@/features/order/controllers/order.controller";

export async function GET(req) {
  const userId = await getAuthUser();
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return getMyOrdersController(req, userId);
}