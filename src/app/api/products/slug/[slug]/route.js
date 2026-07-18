import { getProductBySlugController,updateProductController } from "@/features/product/controllers/product.controller";

export async function GET(req, { params }) {
  const { slug } = await params;

  return getProductBySlugController(slug);
}

export async function PUT(req, { params }) {
  const { id } = await params;

  return updateProductController(req, id);
}