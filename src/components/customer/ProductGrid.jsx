"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// TEMP dummy data — API integration sabse last mein hoga, tab ye array hata ke
// fetch se replace kar denge (jaisa pehle wale version mein tha)
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
    images: ["/assets/images/Women3.webp"],
  },
  {
    _id: "4",
    name: "Grid System Go",
    slug: "grid-system-go",
    price: 30.0,
    stock: 5,
    images: ["/assets/images/Women4.webp"],
  },
];

export default function ProductGrid({ limit = 8 }) {
  const products = DUMMY_PRODUCTS.slice(0, limit);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-5 ">
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} index={i} />
      ))}
    </div>
  );
}

function ProductCard({ product, index }) {
  const image = product.images?.[0] || "/assets/images/Men1.1.webp";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
    >
      <Link href={`/products/${product.slug}`} className="group block ">
        <div className="relative aspect-[3/4] overflow-hidden ">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 25vw"
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
            ${product.price?.toFixed(2)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}