import { updateProductController, deleteProductController } from "@/features/product/controllers/product.controller";
import { requireAdmin } from "@/lib/getAuthUser";

export async function PUT(req, { params }) {
  const check = await requireAdmin();
  if (check.error) {
    return Response.json({ success: false, message: check.error }, { status: check.status });
  }

  const { id } = await params;
  return updateProductController(req, id);
}

export async function DELETE(req, { params }) {
  const check = await requireAdmin();
  if (check.error) {
    return Response.json({ success: false, message: check.error }, { status: check.status });
  }

  const { id } = await params;
  return deleteProductController(id);
}