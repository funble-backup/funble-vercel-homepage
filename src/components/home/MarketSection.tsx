"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";

export default function MarketSection() {
  const ref = useIntersectionObserver();

  return (
    <section ref={ref} className="fade-in-up py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
        <div className="flex-1">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            휙! 사고, 힙!하게 판다.
          </h2>
          <p className="text-gray-600 text-base mb-1">마켓에서</p>
          <p className="text-[rgb(35,184,188)] font-semibold text-lg mb-4">
            주식처럼 <strong>거래</strong>
          </p>
          <p className="text-gray-600 mb-2">
            주식처럼 자유로운 빌딩 투자, 꿈만 같던 투자를 펀블에서
          </p>
          <p className="text-gray-500 text-sm mb-1">
            대형 금융기관들과의 협업으로 더욱 안전한 마켓에서
          </p>
          <p className="text-gray-500 text-sm">
            원하는 만큼 건물 조각을 구매하고 판매해요.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-[280px] h-[480px]">
            <Image
              src="/images/main/img_phone04.png"
              alt="펀블 마켓 화면"
              fill
              sizes="280px"
              className="object-contain"
            />
            <Image
              src="/images/main/img_phone04_2.png"
              alt="펀블 마켓 화면 2"
              fill
              sizes="280px"
              className="object-contain translate-x-8 translate-y-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
