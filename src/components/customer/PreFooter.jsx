"use client";

import Link from "next/link";

export default function PreFooter() {
  return (
    <section className="">
        <div className="h-1.5 bg-[#d9d0ca] mx-2 md:mx-5" />
      <div className="max-w-[1700px] mx-auto px-6 md:px-10 py-8 md:py-8">

        {/* Top */}
        <div className="flex flex-col lg:flex-row  justify-between gap-10">

          {/* Left */}
          <div>
            <h2 className="font-outfit text-[54px] md:text-[88px] text-[#d9d0ca] leading-[0.95] font-bold tracking-[-0.05em]">
              Made to be worn.
            </h2>

            <h2 className="font-outfit text-[54px] md:text-[88px] leading-[0.95] font-bold tracking-[-0.05em] text-[#505050]">
              Or judged. Or both.
            </h2>
          </div>

          {/* Right */}
          <div className="flex justify-end">
            <span className="font-outfit text-[110px] text-[#d9d0ca] md:text-[180px] font-bold leading-none">
              ©26
            </span>
          </div>

        </div>
 <div className="h-36 md:h-52"></div>
        {/* Bottom */}
        <div className="flex flex-col text-[#d9d0ca] md:flex-row justify-between items-end border-b-2 pb-5 border-[#d9d0ca] pt-8">

          <p className="max-w-3xl text-lg md:text-xl leading-tight font-light">
            Created by the <strong>Velora</strong> team, this store and
            signature collection celebrates our collective creativity and
            passion for apparel. Carefully designed.
          </p>

          <Link
            href="/about"
            className="uppercase tracking-[0.25em] text-sm text-[#d9d0ca] hover:text-white transition mt-8 md:mt-0"
          >
            About →
          </Link>

        </div>

      </div>
    </section>
  );
}