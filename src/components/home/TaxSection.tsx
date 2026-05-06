"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";

export default function TaxSection() {
  const ref = useIntersectionObserver();

  return (
    <section ref={ref} className="fade-in-up py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
        <div className="flex-1">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            세금은 하나로, 수익은 최대로
          </h2>
          <p className="text-[rgb(35,184,188)] font-semibold text-lg mb-2">
            취득세, 양도세 없는 가벼운 투자
          </p>
          <p className="text-gray-500 text-sm">
            (DAS 매매차익 / 배당수익에 대한 소득세만 부과)
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-[360px] h-[300px]">
            <Image
              src="/images/main/collect-detail.png"
              alt="펀블 세금 안내"
              fill
              sizes="(max-width: 768px) 90vw, 360px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
