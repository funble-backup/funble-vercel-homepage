"use client";

import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function FunblePage() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out",
    });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#f5f5f5] py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p
            data-aos="fade-up"
            className="text-base md:text-lg text-gray-500 mb-3"
          >
            소수가 아닌 모두를 위한!
          </p>
          <h1
            data-aos="fade-up"
            data-aos-delay="150"
            className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight"
          >
            부동산 투자의 역사를
            <br />
            새로 쓰다
          </h1>
        </div>
      </section>

      {/* TEAM MISSION */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 data-aos="fade-up" className="text-2xl md:text-3xl font-bold mb-4">
            TEAM MISSION
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-gray-500">
            펀블이 추구하는 핵심 가치
          </p>
        </div>

        {/* Mission 1 - Fair Opportunity */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 mb-20">
          <div className="flex-1" data-aos="fade-right">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/funble/img_funble02_01.jpg"
                alt="Fair Opportunity"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1" data-aos="fade-left" data-aos-delay="200">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Fair Opportunity
            </h3>
            <p className="text-[rgb(35,184,188)] font-semibold text-lg mb-4">
              공정한 기회
            </p>
            <p className="text-gray-600 leading-relaxed">
              모든 사람이 부동산 자산에 주식처럼 지분 투자할 수 있습니다.
              <br />
              건물주와 투자자 모두에게 공정한 기회를 제공합니다.
            </p>
          </div>
        </div>

        {/* Mission 2 - Safe & Transparent */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10 mb-20">
          <div className="flex-1" data-aos="fade-left">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/funble/img_funble02_02.jpg"
                alt="Safe & Transparent"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1" data-aos="fade-right" data-aos-delay="200">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Safe & Transparent
            </h3>
            <p className="text-[rgb(35,184,188)] font-semibold text-lg mb-4">
              안전성과 투명성
            </p>
            <p className="text-gray-600 leading-relaxed">
              블록체인 기술 기반의 부동산금융 플랫폼으로
              <br />
              장소에 구애받지 않는 투자가 가능합니다.
            </p>
          </div>
        </div>

        {/* Mission 3 - Easy & Fun */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1" data-aos="fade-right">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/funble/img_funble02_03.jpg"
                alt="Easy & Fun"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1" data-aos="fade-left" data-aos-delay="200">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Easy & Fun</h3>
            <p className="text-[rgb(35,184,188)] font-semibold text-lg mb-4">
              사용 편의성
            </p>
            <p className="text-gray-600 leading-relaxed">
              전문 지식 없이도 접근 가능한 시스템으로
              <br />
              간편한 절차와 사용자 친화적인 플랫폼을 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-[#f5f5f5] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-8">Contact</h2>
          <div className="space-y-3 text-gray-600">
            <p>(07238)서울특별시 영등포구 국회대로72길 4 (여의도동), 9층</p>
            <p>
              <span className="font-medium text-gray-800">TEL</span>{" "}
              1661-3258
            </p>
            <p>
              <span className="font-medium text-gray-800">EMAIL</span>{" "}
              contact@funble.kr
            </p>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-3">펀블 앱 다운로드</h2>
          <p className="text-gray-500 mb-8">
            지금 바로 펀블을 시작해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://play.google.com/store/apps/details?id=kr.funble"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-tight">GET IT ON</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </a>
            <a
              href="https://apps.apple.com/kr/app/funble"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-tight">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
