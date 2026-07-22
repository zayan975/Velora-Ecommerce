"use client";

import { motion } from "framer-motion";

// Apni video files yahan daalo: public/assets/videos/
// Background aur reel dono ke liye same ya alag video use kar sakte ho
const BG_VIDEO = "/assets/videos/Solomei-night.mp4";
const REEL_VIDEO = "/assets/videos/fashion2.mp4";

export default function VideoHero() {
  return (
    <section className="relative w-full min-h-screen mt-5 overflow-hidden flex items-center justify-center">
      {/* Background video — full bleed, blurred */}
      <video
        src={BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-70"
      />

      {/* Dark overlay taake reel video zyada pop kare */}
      <div className="absolute inset-0 bg-ink/40" />

      {/* Center — reel-style portrait video */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-[78vw] max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-bone/10"
      >
        <video
          src={REEL_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          className="w-full h-full object-cover"
        />

        {/* Optional bottom label, jaisa reels pe hota hai */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/70 to-transparent px-4 py-4">
          <span className="text-bone text-xs tracking-[0.15em] uppercase">
            F/W — 26 Collection
          </span>
        </div>
      </motion.div>
    </section>
  );
}