// src/app/api/orders/admin/all/route.js
import { requireAdmin } from "@/lib/getAuthUser";
import { getAllOrdersController } from "@/features/order/controllers/order.controller";

export async function GET(req) {
  const check = await requireAdmin();
  if (check.error) {
    return Response.json({ success: false, message: check.error }, { status: check.status });
  }
  return getAllOrdersController(req);
}