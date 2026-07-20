// controllers/cartController.js
import { NextResponse } from "next/server";
import {
  getCartService,
  addToCartService,
  updateCartQuantityService,
  removeCartItemService,
  clearCartService,
} from "@/features/cart/services/cart.service";

// GET /api/cart
export const getCartController = async (userId) => {
  try {
    const cart = await getCartService(userId);
    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// POST /api/cart
export const addToCartController = async (req, userId) => {
  try {
    const body = await req.json();
    const { productId, quantity, size, color } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId is required." },
        { status: 400 }
      );
    }

    const cart = await addToCartService(userId, { productId, quantity, size, color });
    return NextResponse.json(
      { success: true, message: "Item added to cart.", data: cart },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// PATCH /api/cart
export const updateCartQuantityController = async (req, userId) => {
  try {
    const body = await req.json();
    const { productId, quantity, size, color } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, message: "productId and quantity are required." },
        { status: 400 }
      );
    }

    const cart = await updateCartQuantityService(userId, { productId, quantity, size, color });
    return NextResponse.json(
      { success: true, message: "Cart updated.", data: cart },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// DELETE /api/cart/item
export const removeCartItemController = async (req, userId) => {
  try {
    const body = await req.json();
    const { productId, size, color } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId is required." },
        { status: 400 }
      );
    }

    const cart = await removeCartItemService(userId, { productId, size, color });
    return NextResponse.json(
      { success: true, message: "Item removed.", data: cart },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// DELETE /api/cart
export const clearCartController = async (userId) => {
  try {
    const cart = await clearCartService(userId);
    return NextResponse.json(
      { success: true, message: "Cart cleared.", data: cart },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};