"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-800 text-[#F3ECE5]">
      <div className="max-w-[1700px] mx-auto px-6 md:px-10 py-12">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="space-y-1">
            <h3 className="font-bold text-xl font-outfit">
              Velora
            </h3>

            <p className="text-sm text-[#D8D2CC]">
              All rights reserved © 2026
            </p>
          </div>

          {/* Address */}
          <div className="space-y-1 text-sm leading-7">
            <p>Libertad 2529</p>
            <p>Office 102</p>
            <p>Montevideo, Uruguay</p>
          </div>

          {/* Policy */}
          <div>
            <Link
              href="/privacy-policy"
              className="text-sm hover:text-white transition"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-3 text-sm">
            <Link href="#">Dribbble</Link>
            <Link href="#">Instagram</Link>
            <Link href="#">LinkedIn</Link>
            <Link href="#">Twitter (X)</Link>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">

            <div className="flex flex-col gap-3 text-sm">
              <Link href="/work">Work</Link>
              <Link href="/services">Services</Link>
              <Link href="/about">About</Link>
              <Link href="/careers">Careers</Link>
            </div>

            <div>
              <Link
                href="/contact"
                className="text-sm hover:text-white transition"
              >
                Let's talk
              </Link>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}