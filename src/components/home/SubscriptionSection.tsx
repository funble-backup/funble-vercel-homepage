"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";

export default function SubscriptionSection() {
  const ref = useIntersectionObserver();

  return (
    <section ref={ref} className="fade-in-up py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <p className="text-base md:text-lg text-gray-500 mb-2">뭉쳐야 산다!</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
            누구나 건물투자
          </h2>
          <p className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-[rgb(35,184,188)]">선착순</span> 청약
          </p>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed">
            5천원부터 누구나 선착순으로 청약해요.
            <br />
            누구나 쉬워야 하니까.
            <br />
            쇼핑하듯이 간단한 청약 프로세스로 쉽고 재미있게
            <br />
            건물에 투자하세요.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-[280px] h-[480px]">
            <Image
              src="/images/main/img_phone03.png"
              alt="펀블 청약 화면"
              fill
              className="object-contain"
            />
            <Image
              src="/images/main/img_phone03_2.png"
              alt="펀블 청약 화면 2"
              fill
              className="object-contain translate-x-8 translate-y-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
