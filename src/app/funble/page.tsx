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
      {/* Hero - 배경 이미지 */}
      <section className="relative h-[600px] md:h-[750px] flex items-center justify-center text-center text-white">
        <Image
          src="/images/funble/img_sVisual_01.jpg"
          alt="펀블 소개"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <strong
            data-aos="fade-down"
            className="block text-[2.4rem] md:text-[3rem] font-bold mb-6"
          >
            소수가 아닌 모두를 위한!
          </strong>
          <span
            data-aos="fade-up"
            data-aos-delay="100"
            className="block text-[2rem] md:text-[2.5rem] font-normal mt-4"
          >
            펀블은 투자, 그 이상의 역사를 만들고 있습니다.
          </span>
        </div>
      </section>

      {/* TEAM MISSION */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 data-aos="fade-up" className="text-2xl md:text-3xl font-bold mb-4">
              TEAM MISSION
            </h2>
          </div>

          {/* Mission 1 - Fair Opportunity */}
          <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
            <div className="flex-1" data-aos="fade-up" data-aos-delay="200">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/funble/img_funble02_01.jpg"
                  alt="Fair Opportunity"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Fair Opportunity
              </h3>
              <p className="text-[rgb(35,184,188)] font-semibold text-lg mb-4">
                소수가 아닌 모두에게 공평한 기회를
              </p>
              <p className="text-gray-600 leading-relaxed">
                더 이상 소외되지 마세요. 누구나 갖고 싶어하는 자산들을 원하는 만큼 소유하고 투자할 수 있는 공정한 생태계를 만들어 갑니다. 부동산 소유자는 기존 금융시스템 에서 실현하기 어려웠던 넓은 투자자 풀을 활용하여 간편하게 부동산을 매각하고, 부동산 투자자는 우량 부동산 자산에 주식처럼 지분형태로 실시간 투자가 가능하게 되어 대안 투자 기회의 혁신적인 확장을 경험할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Mission 2 - Safe & Transparent */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-20">
            <div className="flex-1" data-aos="fade-up">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/funble/img_funble02_02.jpg"
                  alt="Safe &amp; Transparent"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Safe&amp;Transparent
              </h3>
              <p className="text-[rgb(35,184,188)] font-semibold text-lg mb-4">
                첨단 IT기술로 안전하고 투명하게
              </p>
              <p className="text-gray-600 leading-relaxed">
                부동산금융에 블록체인기술을 융합하여 투자자가 시간과 장소에 상관 없이 투자할 수 있는 자유를 만듭니다. 더욱 안전하고 투명한 기술을 위해 끊임없이 연구하고 발전시키고 있습니다.
              </p>
            </div>
          </div>

          {/* Mission 3 - Easy & Fun */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1" data-aos="fade-up" data-aos-delay="200">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/funble/img_funble02_03.jpg"
                  alt="Easy &amp; Fun"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Easy&amp;Fun
              </h3>
              <p className="text-[rgb(35,184,188)] font-semibold text-lg mb-4">
                편하고 재미있는 투자
              </p>
              <p className="text-gray-600 leading-relaxed">
                전문 지식 없이도 시작할 수 있도록, 펀블은 쉽습니다. 복잡한 절차와 어려운 법이 투자의 문턱을 높이지 않도록, 펀블은 시스템을 체계화 하여 투자자가 쉽고 재밌게 투자할 수 있는 플랫폼을 지향합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 펀블의 개척자 */}
      <section className="py-20 px-4 bg-[#f5f5f5]">
        <div className="max-w-5xl mx-auto text-center">
          <p data-aos="fade-up" className="text-[1.6rem] md:text-[2.5rem] font-medium text-[#1b1b1b] leading-[1.2] mb-10">
            새로운 투자 세상을 만들어 가고 있는
            <br />
            <strong className="font-bold">펀블의 개척자</strong>들을 소개합니다.
          </p>
          <p data-aos="fade-up" data-aos-delay="200" className="text-[1rem] md:text-[1.25rem] text-[#333] leading-relaxed mb-16">
            <strong className="font-medium">&ldquo;소수가 아닌 모두에게 공평한 투자 기회&rdquo;</strong>
            라는 가치의 실현을 위해
            <br />
            국내외 다양한 유수 기업의 전문가들이 미션을 수행하고 있습니다.
          </p>
          <p data-aos="fade-up" className="text-[1.4rem] md:text-[2.2rem] font-medium text-[#1b1b1b]">
            투자, 그 이상의 역사를
            <br className="md:hidden" />
            <span className="text-[rgb(35,184,188)]"> 금융의 중심에서</span> 만들고 있습니다.
          </p>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p data-aos="fade-up" className="text-[rgb(35,184,188)] font-bold text-lg mb-4">
              Location
            </p>
            <p data-aos="fade-up" data-aos-delay="100" className="text-gray-800 font-medium mb-2">
              서울시 영등포구 의사당대로 83, 서울핀테크랩 18층(여의도동, 오투타워)
            </p>
            <p data-aos="fade-up" data-aos-delay="200" className="text-gray-600">
              1661-3258
            </p>
          </div>
          <div>
            <p data-aos="fade-up" className="text-[rgb(35,184,188)] font-bold text-lg mb-4">
              Contact
            </p>
            <p data-aos="fade-up" data-aos-delay="100" className="text-gray-800 font-medium mb-2">
              대표문의
            </p>
            <p data-aos="fade-up" data-aos-delay="200" className="text-gray-600">
              contact@funble.kr
            </p>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-20 px-4 bg-[#f5f5f5]">
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
