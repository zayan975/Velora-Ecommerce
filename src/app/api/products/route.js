import {
  createProductController,
  getAllProductsController,
} from "@/features/product/controllers/product.controller";

// create product
export async function POST(req) {
  return createProductController(req);
}

// get all product
export async function GET(req) {
  return getAllProductsController(req);
}

