"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function EasyInvestSection() {
  const ref = useIntersectionObserver();

  return (
    <section ref={ref} className="fade-in-up py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
          너무 쉬운 투자
        </h2>
        <p className="text-gray-900 font-semibold text-lg mb-2">
          보유하고 싶은 건물만 고르세요.
        </p>
        <p className="text-gray-500 text-base">
          복잡한 투자 절차, 수많은 세금, 어려운 서류처리 등 머리 아픈 일은 신경 쓸 필요 없어요.
        </p>
      </div>
    </section>
  );
}
