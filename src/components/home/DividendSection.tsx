"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";

export default function DividendSection() {
  const ref = useIntersectionObserver();

  return (
    <section ref={ref} className="fade-in-up py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 flex justify-center">
          <div className="relative w-[280px] h-[480px]">
            <Image
              src="/images/main/img_phone05.png"
              alt="펀블 배당 화면"
              fill
              className="object-contain"
            />
            <Image
              src="/images/main/img_phone05_2.png"
              alt="펀블 배당 화면 2"
              fill
              className="object-contain translate-x-8 translate-y-8"
            />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8">
            배당수익을 쌓아
            <br />
            <span className="text-[rgb(35,184,188)]">두번째 월급</span>을 만들어요.
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">한 주만 매수해도 배당수익</h3>
              <p className="text-gray-600 text-sm">
                매월 임대수익을 배당금으로 지급해요.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">매각수익도 다함께</h3>
              <p className="text-gray-600 text-sm">
                주식의 장점과 부동산 투자의 장점을 동시에! 건물을 매각할 때의 이익을 지분만큼 나눠요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
