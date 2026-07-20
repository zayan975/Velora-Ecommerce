// src/app/api/orders/[id]/pay/route.js
import { getAuthUser } from "@/lib/getAuthUser";
import { createCheckoutSessionController } from "@/features/stripe/controllers/payment.controller";

export async function POST(req, { params }) {
  const userId = await getAuthUser();
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  return createCheckoutSessionController(userId, id);
}