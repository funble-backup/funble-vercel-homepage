"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";

export default function PortfolioSection() {
  const ref = useIntersectionObserver();

  return (
    <section ref={ref} className="fade-in-up py-20 px-4 bg-[#2b2b2b]">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          나만의 자산 포트폴리오 구축,
          <br />
          펀블에서 특별하게!
        </h2>
        <p className="text-gray-300 text-lg mb-10">
          펀블 거래소에서 내가 원하는 자산만 골라담아 나만의 특별한 투자 포트폴리오를 만들 수 있어요.
        </p>
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
          <div className="relative aspect-[3/4]">
            <Image
              src="/images/main/img_portfolio01.png"
              alt="포트폴리오 1"
              fill
              sizes="(max-width: 768px) 33vw, 240px"
              className="object-contain"
            />
          </div>
          <div className="relative aspect-[3/4]">
            <Image
              src="/images/main/img_portfolio02.png"
              alt="포트폴리오 2"
              fill
              sizes="(max-width: 768px) 33vw, 240px"
              className="object-contain"
            />
          </div>
          <div className="relative aspect-[3/4]">
            <Image
              src="/images/main/img_portfolio03.png"
              alt="포트폴리오 3"
              fill
              sizes="(max-width: 768px) 33vw, 240px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
