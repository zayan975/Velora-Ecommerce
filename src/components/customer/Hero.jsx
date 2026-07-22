"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="mt-10 overflow-hidden">
      <div className="px-2 md:px-5 items-center justify-center pt-6 md:pt-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="font-outfit leading-[0.82] text-[#d9d0ca] select-none text-[18vw] sm:text-[20vw] md:text-[22vw] lg:text-[24vw] xl:text-[27vw] tracking-normal font-bold text-center whitespace-nowrap"
        >
          OUTFIT
        </motion.h1>
      </div>

      <div className="h-1.5 bg-[#d9d0ca] mx-2 md:mx-5" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 md:px-8 py-4 text-[#d9d0ca]">
        <div>
          <span className="text-xs tracking-[0.15em] uppercase text-taupe">Velora</span>
        </div>
        <div>
          <span className="text-xs tracking-[0.15em] uppercase text-taupe">Why</span>
          <p className="mt-1 text-sm leading-relaxed max-w-sm text-[#d9d0ca]">
            Created by the ++hellohello team, this store and signature collection celebrates our collective creativity and passion for apparel. Carefully designed.
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-3">
          <span className="text-xs tracking-[0.15em] uppercase text-[#d9d0ca]">
            © {new Date().getFullYear()}
          </span>
          <a href="/products" className="text-xs tracking-[0.15em] uppercase text-[#d9d0ca]">
            Shop the collection
          </a>
        </div>
      </div>
    </section>
  );
}