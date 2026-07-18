import { NextResponse } from "next/server";

import {
  createProductService,
  getAllProductsService,
  getProductBySlugService,
  updateProductService,
  deleteProductService
} from "../services/product.service";


export const createProductController = async (req) => {
  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      images,
      stock,
      featured,
    } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields are missing.",
        },
        { status: 400 }
      );
    }

    const product = await createProductService({
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      images,
      stock,
      featured,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
};

export const getAllProductsController = async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const filters = {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      featured: searchParams.get("featured") || "",
      sort: searchParams.get("sort") || "latest",
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    };

    const result = await getAllProductsService(filters);

    return NextResponse.json({
      success: true,
      total: result.total,
      page: filters.page,
      limit: filters.limit,
      data: result.products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
};

export const getProductBySlugController = async (slug) => {
  try {
    const product = await getProductBySlugService(slug);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 404 }
    );
  }
};

export const updateProductController = async (req, id) => {
  try {
    const body = await req.json();

    const product = await updateProductService(id, body);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
};

export const deleteProductController = async (id) => {
  try {
    const product = await deleteProductService(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 404,
      }
    );
  }
};