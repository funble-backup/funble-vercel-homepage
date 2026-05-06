"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";

export default function MainTagline() {
  const ref = useIntersectionObserver();

  return (
    <section ref={ref} className="fade-in-up py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            생애 첫 건물은 <span className="text-[rgb(35,184,188)]">펀블에서</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            건물 투자를 가장 쉽게 하는 방법. 펀블.
          </p>
          <p className="text-base text-gray-500 mb-8">
            펀블에서 다양한 랜드마크 건물에 투자해보세요.
          </p>
          <a
            href="#"
            className="inline-block bg-[rgb(35,184,188)] hover:bg-[rgb(28,160,164)] text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            다운로드
          </a>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-[280px] h-[560px]">
            <Image
              src="/images/main/img_phone01.png"
              alt="펀블 앱 화면"
              fill
              priority
              sizes="280px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
