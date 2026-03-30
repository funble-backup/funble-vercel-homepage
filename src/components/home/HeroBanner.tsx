"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types";

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

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
          const content = (
            <div className="relative w-full h-[calc(100vh-5rem)] bg-gray-100">
              {/* PC 이미지 */}
              {banner.image_url && (
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  sizes="100vw"
                  className="object-cover hidden md:block"
                  priority={i === 0}
                />
              )}
              {/* 모바일 이미지 */}
              <Image
                src={banner.mobile_image_url || banner.image_url}
                alt={banner.title}
                fill
                sizes="100vw"
                className="object-cover md:hidden"
                priority={i === 0}
              />
            </div>
          );

          return (
            <SwiperSlide key={banner.id}>
              {banner.link_url ? (
                <Link href={banner.link_url}>
                  {content}
                </Link>
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
