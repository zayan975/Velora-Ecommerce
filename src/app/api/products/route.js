import {
  createProductController,
  getAllProductsController,
} from "@/features/product/controllers/product.controller";
import { requireAdmin } from "@/lib/getAuthUser";

// create product — sirf admin
export async function POST(req) {
  const check = await requireAdmin();
  if (check.error) {
    return Response.json({ success: false, message: check.error }, { status: check.status });
  }

  return createProductController(req);
}

// get all product — public, koi change nahi
export async function GET(req) {
  return getAllProductsController(req);
}