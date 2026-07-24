"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";


const SHIPPING_FLAT_RATE = 10;

export default function CartPage() {
 const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchCart();
}, []);

const fetchCart = async () => {
  try {
    const res = await fetch("/api/cart");

    const data = await res.json();

    if (data.success) {
      setItems(data.data.items);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
if (loading) {
  return (
    <div className="py-32 text-center text-white">
      Loading...
    </div>
  );
}
 
const updateQuantity = async (productId, quantity) => {
  try {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    const data = await res.json();

    if (data.success) {
      fetchCart();
    }
  } catch (err) {
    console.log(err);
  }
};

 const removeItem = async (productId) => {
  try {
    const res = await fetch("/api/cart/item", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      fetchCart();
    }
  } catch (err) {
    console.log(err);
  }
};

  const subtotal = items.reduce(
  (sum, item) => sum + item.product.price * item.quantity,
  0
);
  const shipping = subtotal > 0 ? SHIPPING_FLAT_RATE : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display italic text-3xl text-[#d9d0ca] mb-3">Your bag is empty</h1>
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
  <section className="max-w-4xl mx-auto bg-amber-50 px-5 md:px-8 py-8 md:py-14">
    <h1 className="font-display italic text-3xl md:text-4xl text-[#d9d0ca] mb-10">
      Your bag
    </h1>

    <div className="flex flex-col">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.product._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-4 md:gap-6 py-6 border-b border-ink/10"
          >
            <Link
              href={`/products/${item.product.slug}`}
              className="relative w-20 h-24 md:w-24 md:h-28 flex-none bg-ink/5 overflow-hidden"
            >
              <Image
                src={item.product.images?.[0] || "/assets/images/placeholder.webp"}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product.slug}`}>
                <p className="text-sm md:text-base text-[#d9d0ca] truncate hover:text-rose transition-colors">
                  {item.product.name}
                </p>
              </Link>

              {item.size && (
                <p className="text-xs text-taupe mt-1">
                  Size {item.size}
                </p>
              )}

              <p className="text-sm text-[#d9d0ca] mt-2 md:hidden">
                ${item.product.price.toFixed(2)}
              </p>

              {/* Mobile Quantity */}
              <div className="inline-flex items-center border border-ink/20 mt-3 md:hidden">
                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
                >
                  <Minus size={12} />
                </button>

                <span className="w-8 text-center text-sm">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity + 1)
                  }
                  disabled={item.quantity >= item.product.stock}
                  className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Desktop Price */}
            <span className="hidden md:block text-sm w-16 text-right">
              ${item.product.price.toFixed(2)}
            </span>

            {/* Desktop Quantity */}
            <div className="hidden md:inline-flex items-center border border-ink/20">
              <button
                onClick={() =>
                  updateQuantity(item.product._id, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
                className="w-9 h-9 flex items-center justify-center disabled:opacity-30"
              >
                <Minus size={13} />
              </button>

              <span className="w-9 text-center text-sm">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  updateQuantity(item.product._id, item.quantity + 1)
                }
                disabled={item.quantity >= item.product.stock}
                className="w-9 h-9 flex items-center justify-center disabled:opacity-30"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Total */}
            <span className="hidden md:block text-sm w-16 text-right">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>

            <button
              onClick={() => removeItem(item.product._id)}
              className="flex-none hover:text-red-500 transition"
            >
              <Trash2 size={17} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    {/* Summary */}
    <div className="mt-8 flex flex-col items-end gap-2.5">
      <div className="w-full sm:w-64 flex justify-between text-sm">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="w-full sm:w-64 flex justify-between text-sm">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>

      <div className="w-full sm:w-64 flex justify-between border-t pt-2 font-medium">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <Link
        href="/checkout"
        className="w-full sm:w-64 text-center mt-4 py-4 bg-black text-white uppercase tracking-wider"
      >
        Proceed to checkout
      </Link>

      <Link
        href="/products"
        className="text-xs mt-2 hover:underline"
      >
        Continue shopping
      </Link>
    </div>
  </section>
);
}