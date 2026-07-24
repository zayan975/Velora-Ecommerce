"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";





export default function ProductDetail() {
  const { slug } = useParams();
const [product, setproduct] = useState(null);
const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const SIZES = ["XS", "S", "M", "L", "XL"];

useEffect(() => {
  const fetchproduct = async () => {
    try {
      const res = await fetch(`/api/products/slug/${slug}`);
      const data = await res.json();

      if (data.success) {
        setproduct(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (slug) {
    fetchproduct();
  }
}, [slug]);
if (loading) {
  return (
    <div className="py-32 text-center text-white">
      Loading...
    </div>
  );
}

if (!product) {
  return (
    <div className="py-32 text-center text-white">
      product not found
    </div>
  );
}

const handleAddToCart = async () => {
  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,
        quantity,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Added to cart");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};



  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(product.stock, q + 1));



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
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
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
            {product.name}
          </h1>
          <span className="text-lg text-[#d9d0ca] mt-2">${product.price.toFixed(2)}</span>

          <p className="text-sm text-[#d9d0ca] leading-relaxed mt-5 max-w-md">
            {product.description}
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
              {SIZES.map((size) => (
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
                disabled={quantity >= product.stock}
                className="w-10 h-10 flex items-center justify-center text-[#d9d0ca] disabled:opacity-30 hover:bg-ink/5 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {product.stock <= 5 && (
              <p className="text-xs text-[#d9d0ca] mt-2">
                Only {product.stock} left in stock
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