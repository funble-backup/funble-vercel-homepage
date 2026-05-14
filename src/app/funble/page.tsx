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
          sizes="100vw"
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
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                  sizes="(max-width: 768px) 100vw, 50vw"
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
            서울특별시 영등포구 국회대로72길 4 (여의도동), 9층
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

      
    </div>
  );
}
