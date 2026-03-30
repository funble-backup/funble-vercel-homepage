"use client";

import { useEffect, useState } from "react";

interface Counts {
  notices: number;
  stocks: number;
  announcements: number;
  stockPrices: number;
  faqCategories: number;
  faqs: number;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    async function loadCounts() {
      try {
        const [notices, stocks, faqCats, faqs] = await Promise.all([
          fetch("/api/notices?page=1").then((r) => r.json()),
          fetch("/api/stocks").then((r) => r.json()),
          fetch("/api/faq-categories").then((r) => r.json()),
          fetch("/api/faqs").then((r) => r.json()),
        ]);
        setCounts({
          notices: notices.totalCount ?? notices.data?.length ?? 0,
          stocks: stocks.length ?? 0,
          announcements: 0,
          stockPrices: 0,
          faqCategories: Array.isArray(faqCats) ? faqCats.length : 0,
          faqs: faqs.data?.length ?? 0,
        });
      } catch {
        setCounts({
          notices: 0,
          stocks: 0,
          announcements: 0,
          stockPrices: 0,
          faqCategories: 0,
          faqs: 0,
        });
      }
    }
    loadCounts();
  }, []);

  const cards = counts
    ? [
        { label: "공지사항", count: counts.notices },
        { label: "종목", count: counts.stocks },
        { label: "FAQ 카테고리", count: counts.faqCategories },
        { label: "FAQ 항목", count: counts.faqs },
      ]
    : [];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">대시보드</h2>
      {!counts ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white p-5 rounded-lg border border-gray-200"
            >
              <p className="text-sm text-gray-500 mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
