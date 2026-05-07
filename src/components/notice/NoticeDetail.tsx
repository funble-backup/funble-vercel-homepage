"use client";

import Link from "next/link";
import { Notice } from "@/types";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

interface NoticeDetailProps {
  notice: Notice;
}

export default function NoticeDetail({ notice }: NoticeDetailProps) {
  return (
    <div>
      <div className="border-t-2 border-gray-800">
        <div className="py-6 px-4 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{notice.title}</h2>
          <p className="text-sm text-gray-400">{notice.created_at?.substring(0, 10)}</p>
        </div>
        <div
          className="py-8 px-4 text-sm leading-relaxed text-gray-700 min-h-[200px] prose max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(notice.content) }}
        />
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/notice"
          className="inline-block px-8 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          목록으로
        </Link>
      </div>
    </div>
  );
}
