// src/app/api/orders/[id]/route.js
import { auth } from "@/auth";
import { getOrderDetailsController } from "@/features/order/controllers/order.controller";

export async function GET(req, { params }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  return getOrderDetailsController(session.user.id, session.user.role, id);
}