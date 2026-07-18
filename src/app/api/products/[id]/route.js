import { updateProductController,deleteProductController } from "@/features/product/controllers/product.controller";

export async function PUT(req, { params }) {
  const { id } = await params;

  return updateProductController(req, id);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  return deleteProductController(id);
}