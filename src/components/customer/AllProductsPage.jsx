"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// TEMP dummy data — API integration sabse last mein hoga
// (asal mein GET /api/products?category=&sort=&page=&search= se aayega)
const ALL_PRODUCTS = [
  { _id: "1", name: "Off by Design", slug: "off-by-design", price: 36.5, category: "men", stock: 12, images: ["/assets/images/Men1.1.webp"] },
  { _id: "2", name: "Kerned Confidence", slug: "kerned-confidence", price: 25.0, category: "men", stock: 8, images: ["/assets/images/Men2.2.webp"] },
  { _id: "3", name: "Specimen No. HH01", slug: "specimen-hh01", price: 30.0, category: "women", stock: 0, images: ["/assets/images/Men3.webp"] },
  { _id: "4", name: "Grid System Go", slug: "grid-system-go", price: 30.0, category: "women", stock: 5, images: ["/assets/images/Men4.webp"] },
  { _id: "5", name: "Ink Wash Tee", slug: "ink-wash-tee", price: 18.0, category: "men", stock: 20, images: ["/assets/images/Men1.1.webp"] },
  { _id: "6", name: "Structured Tote", slug: "structured-tote", price: 45.0, category: "others", stock: 6, images: ["/assets/images/Men2.2.webp"] },
  { _id: "7", name: "Belted Trench", slug: "belted-trench", price: 89.0, category: "women", stock: 4, images: ["/assets/images/Men3.webp"] },
  { _id: "8", name: "Wool Beanie", slug: "wool-beanie", price: 15.0, category: "others", stock: 15, images: ["/assets/images/Men4.webp"] },
  { _id: "9", name: "Relaxed Chino", slug: "relaxed-chino", price: 42.0, category: "men", stock: 9, images: ["/assets/images/Men1.1.webp"] },
  { _id: "10", name: "Satin Slip Dress", slug: "satin-slip-dress", price: 55.0, category: "women", stock: 7, images: ["/assets/images/Men2.2.webp"] },
];

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Others", value: "others" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const PAGE_SIZE = 6;

export default function AllProductsPage() {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Ye sara filtering/sorting/pagination abhi client-side hai (dummy data ke liye).
  // API integration ke baad ye backend query params (?category=&sort=&page=&search=) se hoga.
  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (search.trim()) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [category, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeCategory = (value) => {
    setCategory(value);
    setPage(1);
  };

  const changeSort = (value) => {
    setSort(value);
    setSortOpen(false);
    setPage(1);
  };

  const changeSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-14">
      <h1 className="font-display italic text-3xl md:text-4xl text-ink mb-8">
        All products
      </h1>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => changeCategory(c.value)}
              className={`px-4 py-2 text-xs tracking-[0.08em] uppercase border transition-colors ${
                category === c.value
                  ? "bg-ink text-bone border-ink"
                  : "border-ink/20 text-ink hover:border-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 md:flex-none">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
            <input
              type="text"
              value={search}
              onChange={changeSearch}
              placeholder="Search products…"
              className="w-full md:w-56 pl-9 pr-3 py-2.5 text-sm bg-transparent border border-ink/15 text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.08em] uppercase border border-ink/15 text-ink hover:border-ink transition-colors whitespace-nowrap"
            >
              {SORT_OPTIONS.find((s) => s.value === sort)?.label}
              <ChevronDown size={13} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 z-40 w-52 bg-bone border border-ink/10 shadow-sm"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => changeSort(opt.value)}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sort === opt.value ? "text-ink font-medium" : "text-taupe hover:text-ink"
                      } hover:bg-ink/5`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-taupe mb-5">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      {/* Product grid */}
      {paginated.length === 0 ? (
        <p className="text-center text-taupe text-sm py-20">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
          {paginated.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center text-ink disabled:opacity-30 hover:bg-ink/5 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 flex items-center justify-center text-sm transition-colors ${
                page === i + 1 ? "bg-ink text-bone" : "text-ink hover:bg-ink/5"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center text-ink disabled:opacity-30 hover:bg-ink/5 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}

function ProductCard({ product, index }) {
  const image = product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: "easeOut" }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-ink text-bone text-[10px] tracking-[0.1em] uppercase px-2 py-1">
              Sold out
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 pt-3">
          <span className="text-ink text-sm truncate">{product.name}</span>
          <span className="text-ink text-sm whitespace-nowrap">${product.price.toFixed(2)}</span>
        </div>
      </Link>
    </motion.div>
  );
}