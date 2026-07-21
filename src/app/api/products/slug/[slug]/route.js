import { getProductBySlugController, updateProductController } from "@/features/product/controllers/product.controller";
import { requireAdmin } from "@/lib/getAuthUser";

// GET — public, koi change nahi
export async function GET(req, { params }) {
  const { slug } = await params;
  return getProductBySlugController(slug);
}

// PUT — sirf admin
export async function PUT(req, { params }) {
  const check = await requireAdmin();
  if (check.error) {
    return Response.json({ success: false, message: check.error }, { status: check.status });
  }

  const { slug } = await params; // <-- 'id' nahi, 'slug' hai — fix kiya
  return updateProductController(req, slug); // agar controller ID expect karta hai to niche note dekho
}