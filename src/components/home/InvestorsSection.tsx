"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";

const INVESTOR_LOGOS = [
  "img_investor01.jpg", "img_investor02.jpg", "img_investor03.jpg",
  "img_investor04.jpg", "img_investor05.jpg",
];

export default function InvestorsSection() {
  const ref = useIntersectionObserver();

  return (
    <section ref={ref} className="fade-in-up py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm font-semibold text-gray-400 tracking-widest text-center mb-2">
          INVESTORS
        </h2>
        <p className="text-center text-gray-600 mb-10">
          펀블과 함께 혁신의 가능성을 실현시켜 나가고 있어요.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-3xl mx-auto">
          {INVESTOR_LOGOS.map((logo) => (
            <div
              key={logo}
              className="bg-gray-50 rounded-xl h-20 flex items-center justify-center border border-gray-100 p-3"
            >
              <Image
                src={`/images/investors/${logo}`}
                alt={logo.replace('.jpg', '')}
                width={120}
                height={48}
                className="object-contain max-h-10"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
