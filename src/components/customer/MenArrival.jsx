"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGrid({ limit = 8 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?category=men");

        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-white">
        Loading Products...
      </div>
    );
  }

  return (
    <section className="py-16">
      {/* Heading */}
      <div className="flex items-center justify-between px-5 mb-8">
        <h2 className="text-3xl md:text-5xl font-semibold font-outfit text-[#d9d0ca]">
          Men's Arrival
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={scrollLeft}
            className="w-11 h-11 rounded-full border border-[#444] flex items-center justify-center text-[#d9d0ca] hover:bg-white hover:text-black transition duration-300"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={scrollRight}
            className="w-11 h-11 rounded-full border border-[#444] flex items-center justify-center text-[#d9d0ca] hover:bg-white hover:text-black transition duration-300"
          >
            <ChevronRight size={22} />
          </button>

          <Link
            href="/products"
            className="hidden md:block ml-4 text-sm uppercase tracking-[0.2em] text-[#d9d0ca] hover:opacity-70"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide px-5"
      >
        {products.slice(0, limit).map((product, i) => (
          <div
            key={product._id}
            className="min-w-[220px] md:min-w-[300px] flex-shrink-0"
          >
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, index }) {
  const image =
    product.images?.[0] || "/assets/images/placeholder.webp";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
      }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 220px, 300px"
          />

          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase px-2 py-1 tracking-wider">
              Sold Out
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-3">
          <h3 className="text-[#d9d0ca] text-sm md:text-base truncate">
            {product.name}
          </h3>

          <span className="text-[#d9d0ca] text-sm md:text-base">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}