// src/app/api/orders/admin/[id]/payment/route.js
import { requireAdmin } from "@/lib/getAuthUser";
import { updatePaymentStatusController } from "@/features/order/controllers/order.controller";

export async function PATCH(req, { params }) {
  const check = await requireAdmin();
  if (check.error) {
    return Response.json({ success: false, message: check.error }, { status: check.status });
  }

  const { id } = await params;
  return updatePaymentStatusController(req, id);
}