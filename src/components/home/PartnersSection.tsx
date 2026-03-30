"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";

const PARTNER_LOGOS = [
  "img_partner01.jpg", "img_partner02.jpg", "img_partner03.jpg",
  "img_partner04.jpg", "img_partner05.jpg", "img_partner06.jpg",
  "img_partner07.jpg", "img_partner08.jpg", "img_partner09.jpg",
  "img_partner10.jpg", "img_partner12.jpg",
];

export default function PartnersSection() {
  const ref = useIntersectionObserver();

  return (
    <section ref={ref} className="fade-in-up py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm font-semibold text-gray-400 tracking-widest text-center mb-2">
          PARTNERS
        </h2>
        <p className="text-center text-gray-600 mb-10">
          대한민국 최고의 금융기관들이 펀블과 함께 해요.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo}
              className="bg-white rounded-xl h-20 flex items-center justify-center border border-gray-100 p-3"
            >
              <Image
                src={`/images/partners/${logo}`}
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
