// src/app/api/checkout/route.js
import { getAuthUser } from "@/lib/getAuthUser";
import { checkoutSummaryController } from "@/features/checkout/controllers/checkout.controller";

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return checkoutSummaryController(userId);
}