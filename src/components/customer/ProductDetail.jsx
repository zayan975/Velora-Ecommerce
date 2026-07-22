"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";

// TEMP dummy data — API integration sabse last mein hoga
const PRODUCT = {
  name: "Off by Design",
  price: 36.5,
  description:
    "A relaxed-fit essential cut from heavyweight cotton jersey. Finished with a subtle back placement print and a dropped shoulder seam for an easy, oversized silhouette.",
  stock: 12,
  sizes: ["XS", "S", "M", "L", "XL"],
  images: [
    "/assets/images/Men1.1.webp",
    "/assets/images/Men2-2.webp",
    "/assets/images/Men3.webp",
    "/assets/images/Men4.webp",
  ],
};

export default function ProductDetail() {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(PRODUCT.stock, q + 1));

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    // API integration baad mein: POST /api/cart { productId, quantity, size }
    console.log("Add to cart:", { size: selectedSize, quantity });
  };

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        {/* Left — image gallery */}
        <div>
          <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={PRODUCT.images[activeImage]}
                  alt={PRODUCT.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
            {PRODUCT.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`relative flex-none w-16 md:w-20 aspect-[3/4] overflow-hidden bg-ink/5 transition-opacity ${
                  activeImage === i ? "opacity-100 ring-1 ring-ink" : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        {/* Right — product info */}
        <div className="flex flex-col">
          <h1 className="font-outfit text-3xl md:text-4xl text-[#d9d0ca]">
            {PRODUCT.name}
          </h1>
          <span className="text-lg text-[#d9d0ca] mt-2">${PRODUCT.price.toFixed(2)}</span>

          <p className="text-sm text-[#d9d0ca] leading-relaxed mt-5 max-w-md">
            {PRODUCT.description}
          </p>

          <div className="h-px bg-[#d9d0ca] my-7" />

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs tracking-[0.15em] uppercase text-[#d9d0ca]">Size</span>
              {sizeError && (
                <span className="text-xs text-[#d9d0ca]">Please select a size</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {PRODUCT.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`w-11 h-11 text-sm border transition-colors ${
                    selectedSize === size
                      ? "bg-white/20 text-[#d9d0ca] border-[#d9d0ca]"
                      : "border-[#d9d0ca] text-[#d9d0ca] hover:border-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="mt-7">
            <span className="block text-xs tracking-[0.15em] uppercase text-[#d9d0ca] mb-3">
              Quantity
            </span>
            <div className="inline-flex items-center border border-[#d9d0ca]">
              <button
                onClick={decreaseQty}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-[#d9d0ca] disabled:opacity-30 hover:bg-ink/5 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm text-[#d9d0ca]">{quantity}</span>
              <button
                onClick={increaseQty}
                disabled={quantity >= PRODUCT.stock}
                className="w-10 h-10 flex items-center justify-center text-[#d9d0ca] disabled:opacity-30 hover:bg-ink/5 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {PRODUCT.stock <= 5 && (
              <p className="text-xs text-[#d9d0ca] mt-2">
                Only {PRODUCT.stock} left in stock
              </p>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="mt-8 w-full py-4 bg-ink text-bone text-[13px] tracking-[0.1em] uppercase hover:opacity-90 active:scale-[0.99] transition-all"
          >
            Add to cart
          </button>

          <div className="mt-6 flex flex-col gap-1.5 text-xs text-taupe">
            <span>Free shipping on orders over $150</span>
            <span>Delivered in 3–5 business days</span>
          </div>
        </div>
      </div>
    </section>
  );
}