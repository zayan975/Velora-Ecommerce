import slugify from "slugify";
import connectDB from "@/lib/db";
import {
  createProduct,
  findProductBySlug,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct
} from "../repositories/product.repository";

export const createProductService = async (data) => {
  await connectDB();

  let slug = slugify(data.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  // Duplicate slug check
  const existingProduct = await findProductBySlug(slug);

  if (existingProduct) {
    throw new Error("Product already exists");
  }

  // Discount validation
  if (data.discountPrice > data.price) {
    throw new Error("Discount price cannot be greater than price");
  }

  const product = await createProduct({
    ...data,
    slug,
  });

  return product;
};

export const getAllProductsService = async (filters) => {
  await connectDB();

  return await getAllProducts(filters);
};

export const getProductBySlugService = async (slug) => {
  await connectDB();

  const product = await getProductBySlug(slug);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const updateProductService = async (id, data) => {
  await connectDB();

  if (data.discountPrice && Number(data.discountPrice) > Number(data.price)) {
    throw new Error("Discount price cannot be greater than price");
  }

  const product = await updateProduct(id, data);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const deleteProductService = async (id) => {
  await connectDB();

  const product = await deleteProduct(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};