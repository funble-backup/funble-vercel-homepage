"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { Press } from "@/types";

export default function NewsroomSection() {
  const ref = useIntersectionObserver();
  const [news, setNews] = useState<Press[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/press?limit=3")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <section ref={ref} className="fade-in-up py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
          FUNBLE NEWSROOM
        </h2>
        {!loaded ? (
          <p className="text-center text-gray-400">로딩 중...</p>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-400 mb-2">
                  {item.notice_at?.slice(0, 10)}
                </p>
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {item.title}
                </h3>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">보도자료가 없습니다.</p>
        )}
      </div>
    </section>
  );
}
