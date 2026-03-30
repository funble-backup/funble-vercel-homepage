"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function RecruitSection() {
  const ref1 = useIntersectionObserver();
  const ref2 = useIntersectionObserver();

  return (
    <>
      {/* 다운로드 CTA */}
      <section ref={ref1} className="fade-in-up py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            펀블을 가장 먼저 만나보세요!
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            재미있게 빌딩에 투자하고 <strong>편하게 자산을 불리는 곳, 펀블!</strong>
          </p>
          <a
            href="#"
            className="inline-block bg-[rgb(35,184,188)] hover:bg-[rgb(28,160,164)] text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            다운로드
          </a>
        </div>
      </section>

      {/* 채용 CTA */}
      <section ref={ref2} className="fade-in-up py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            그 재미있는 여정을 함께 할 Crew 모집해요!!
          </p>
          <a
            href="https://funble.careers.team"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-[rgb(35,184,188)] text-[rgb(35,184,188)] hover:bg-[rgb(35,184,188)] hover:text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            펀블채용
          </a>
        </div>
      </section>
    </>
  );
}
