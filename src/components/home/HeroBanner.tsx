"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types";

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  if (banners.length === 0) return null;

  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        speed={700}
        loop={banners.length > 1}
        className="w-full"
      >
        {banners.map((banner, i) => {
          const mobileSrc = banner.mobile_image_url || banner.image_url;
          const content = (
            <div className="relative w-full h-[calc(100vh-5rem)] bg-gray-100">
              {/* PC: display:none이면 fill+sizes 측정이 어긋나 레이아웃별 래퍼로 분리 */}
              {banner.image_url ? (
                <div className="absolute inset-0 hidden md:block">
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    sizes="(min-width: 768px) 100vw, 0px"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ) : null}
              {mobileSrc ? (
                <div className="absolute inset-0 md:hidden">
                  <Image
                    src={mobileSrc}
                    alt={banner.title}
                    fill
                    sizes="(min-width: 768px) 0px, 100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ) : null}
            </div>
          );

          return (
            <SwiperSlide key={banner.id}>
              {banner.link_url ? (
                banner.link_url.startsWith("http") ? (
                  <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  <Link href={banner.link_url}>
                    {content}
                  </Link>
                )
              ) : (
                content
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
