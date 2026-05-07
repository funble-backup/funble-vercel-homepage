"use client";

import { useState } from "react";
import { Faq } from "@/types";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

interface FaqAccordionProps {
  faqs: Faq[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  if (faqs.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        등록된 FAQ가 없습니다.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 border-t border-gray-200">
      {faqs.map((faq) => (
        <div key={faq.id}>
          <button
            onClick={() => toggle(faq.id)}
            className="w-full flex items-center justify-between py-5 px-2 text-left hover:bg-gray-50/50 transition-colors"
          >
            <span className="text-[15px] text-gray-800 leading-relaxed pr-4">
              {faq.question}
            </span>
            <svg
              className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                openId === faq.id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`grid transition-all duration-200 ease-in-out ${
              openId === faq.id
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-2 pb-5">
                <div
                  className="text-[14px] text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer) }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
