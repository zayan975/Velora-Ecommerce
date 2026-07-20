// app/api/cart/item/route.js
import { getAuthUser } from "@/lib/getAuthUser";
import { removeCartItemController } from "@/features/cart/controllers/cart.controller";

export async function DELETE(req) {
  const userId = await getAuthUser();
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return removeCartItemController(req, userId);
}