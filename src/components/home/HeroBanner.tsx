"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

const slides = [
  { src: "/images/banners/banner1_pc.png", alt: "펀블 매진 공지" },
  { src: "/images/banners/banner2_pc.jpg", alt: "펀블 앱 다운로드" },
  { src: "/images/banners/banner3_pc.jpg", alt: "펀블 포인트 이벤트" },
];

export default function HeroBanner() {
  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        speed={700}
        loop
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[calc(100vh-5rem)] bg-gray-100">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
