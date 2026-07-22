"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DUMMY_PRODUCTS = [
  {
    _id: "1",
    name: "Off by Design",
    slug: "off-by-design",
    price: 36.5,
    stock: 12,
    images: ["/assets/images/Men1.1.webp"],
  },
  {
    _id: "2",
    name: "Kerned Confidence",
    slug: "kerned-confidence",
    price: 25.0,
    stock: 8,
    images: ["/assets/images/Men5.webp"],
  },
  {
    _id: "3",
    name: "Specimen No. HH01",
    slug: "specimen-hh01",
    price: 30.0,
    stock: 0,
    images: ["/assets/images/Men2-2.webp"],
  },
  {
    _id: "4",
    name: "Grid System Go",
    slug: "grid-system-go",
    price: 30.0,
    stock: 5,
    images: ["/assets/images/Men4.webp"],
  },
  {
    _id: "5",
    name: "Classic Essentials",
    slug: "classic-essentials",
    price: 42.0,
    stock: 15,
    images: ["/assets/images/Men1.1.webp"],
  },
  {
    _id: "6",
    name: "Urban Layers",
    slug: "urban-layers",
    price: 39.0,
    stock: 7,
    images: ["/assets/images/Men5.webp"],
  },
];

export default function ProductGrid({ limit = 8 }) {
  const products = DUMMY_PRODUCTS.slice(0, limit);

  const sliderRef = useRef(null);

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
        className="flex gap-5 overflow-hidden scroll-smooth scrollbar-hide px-5"
      >
        {products.map((product, i) => (
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
  const image = product.images?.[0] || "/assets/images/Men1.1.webp";

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