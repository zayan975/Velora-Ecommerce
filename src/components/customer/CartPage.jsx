"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";

// TEMP dummy data — API integration sabse last mein hoga
// (asal mein GET /api/cart se aayega)
const INITIAL_ITEMS = [
  {
    id: "1",
    productId: "p1",
    name: "Kerned Confidence",
    price: 25,
    quantity: 1,
    size: "M",
    stock: 8,
    image: "/assets/images/Men2-2.webp",
  },
  {
    id: "2",
    productId: "p2",
    name: "Off by Design",
    price: 36.5,
    quantity: 2,
    size: "L",
    stock: 12,
    image: "/assets/images/Men1.1.webp",
  },
];

const SHIPPING_FLAT_RATE = 10;

export default function CartPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(item.stock, Math.max(1, item.quantity + delta)) }
          : item
      )
    );
    // API integration baad mein: PATCH /api/cart { productId, quantity }
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    // API integration baad mein: DELETE /api/cart/item { productId }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? SHIPPING_FLAT_RATE : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display italic text-3xl text-ink mb-3">Your bag is empty</h1>
        <p className="text-sm text-taupe mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3.5 bg-ink text-bone text-[13px] tracking-[0.1em] uppercase hover:opacity-90 transition-opacity"
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-5 md:px-8 py-8 md:py-14">
      <h1 className="font-display italic text-3xl md:text-4xl text-ink mb-10">
        Your bag
      </h1>

      <div className="flex flex-col">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-4 md:gap-6 py-6 border-b border-ink/10"
            >
              <Link
                href={`/products/${item.productId}`}
                className="relative w-20 h-24 md:w-24 md:h-28 flex-none bg-ink/5 overflow-hidden"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productId}`}>
                  <p className="text-sm md:text-base text-ink truncate hover:text-rose transition-colors">
                    {item.name}
                  </p>
                </Link>
                <p className="text-xs text-taupe mt-1">Size {item.size}</p>
                <p className="text-sm text-ink mt-2 md:hidden">${item.price.toFixed(2)}</p>

                {/* Quantity stepper — mobile pe yahan bhi dikhega */}
                <div className="inline-flex items-center border border-ink/20 mt-3 md:hidden">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-ink disabled:opacity-30"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm text-ink">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-8 h-8 flex items-center justify-center text-ink disabled:opacity-30"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* Desktop — price, stepper, delete in a row */}
              <span className="hidden md:block text-sm text-ink w-16 text-right">
                ${item.price.toFixed(2)}
              </span>

              <div className="hidden md:inline-flex items-center border border-ink/20">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center text-ink disabled:opacity-30 hover:bg-ink/5 transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-9 text-center text-sm text-ink">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-9 h-9 flex items-center justify-center text-ink disabled:opacity-30 hover:bg-ink/5 transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>

              <span className="hidden md:block text-sm text-ink w-16 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
                className="text-taupe hover:text-rose-deep transition-colors flex-none"
              >
                <Trash2 size={17} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="mt-8 flex flex-col items-end gap-2.5">
        <div className="w-full sm:w-64 flex items-center justify-between text-sm text-taupe">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="w-full sm:w-64 flex items-center justify-between text-sm text-taupe">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="w-full sm:w-64 flex items-center justify-between text-base text-ink font-medium pt-2 border-t border-ink/10">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Link
          href="/checkout"
          className="w-full sm:w-64 text-center mt-4 py-4 bg-ink text-bone text-[13px] tracking-[0.1em] uppercase hover:opacity-90 active:scale-[0.99] transition-all"
        >
          Proceed to checkout
        </Link>

        <Link
          href="/products"
          className="text-xs text-taupe hover:text-ink transition-colors mt-2"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}