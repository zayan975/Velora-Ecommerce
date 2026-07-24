"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProductGrid({ limit = 8 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?featured=true");
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-white">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-5">
      {products.slice(0, limit).map((product, i) => (
        <ProductCard
          key={product._id}
          product={product}
          index={i}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, index }) {
  const image = product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        ease: "easeOut",
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width:768px) 50vw,25vw"
          />

          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-ink text-bone text-[10px] tracking-[0.1em] uppercase px-2 py-1">
              Sold out
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-3">
          <span className="text-[#d9d0ca] font-sans text-sm md:text-base font-medium truncate">
            {product.name}
          </span>

          <span className="text-[#d9d0ca] font-sans text-sm md:text-base whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}