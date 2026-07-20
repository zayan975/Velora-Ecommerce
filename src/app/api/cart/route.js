// app/api/cart/route.js
import { getAuthUser } from "@/lib/getAuthUser";
import {
  getCartController,
  addToCartController,
  updateCartQuantityController,
  clearCartController,
} from "@/features/cart/controllers/cart.controller";

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return getCartController(userId);
}

export async function POST(req) {
  const userId = await getAuthUser();
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return addToCartController(req, userId);
}

export async function PATCH(req) {
  const userId = await getAuthUser();
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return updateCartQuantityController(req, userId);
}

export async function DELETE() {
  const userId = await getAuthUser();
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return clearCartController(userId);
}