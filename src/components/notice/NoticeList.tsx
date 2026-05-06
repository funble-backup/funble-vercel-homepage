"use client";

import Link from "next/link";
import { Notice } from "@/types";
import Pagination from "@/components/common/Pagination";

interface NoticeListProps {
  notices: Notice[];
  page: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export default function NoticeList({
  notices,
  page,
  totalPages,
  loading,
  onPageChange,
}: NoticeListProps) {
  return (
    <div className={`transition-opacity duration-150 ${loading ? "opacity-40 pointer-events-none" : ""}`}>
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[80px_1fr_140px] border-t-2 border-gray-800 py-3 px-4 text-sm font-medium text-gray-500 bg-gray-50">
        <span className="text-center">번호</span>
        <span>제목</span>
        <span className="text-center">작성일</span>
      </div>

      {/* List */}
      {notices.length === 0 ? (
        <div className="py-20 text-center text-gray-400">등록된 공지사항이 없습니다.</div>
      ) : (
        <ul className="border-t border-gray-200">
          {notices.map((notice) => (
            <li key={notice.id} className="border-b border-gray-100">
              <Link
                href={`/notice/${notice.id}`}
                className="grid grid-cols-1 md:grid-cols-[80px_1fr_140px] py-4 px-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <span className="hidden md:block text-center text-sm text-gray-400">{notice.id}</span>
                <span className="text-sm md:text-base text-gray-800 hover:text-primary">{notice.title}</span>
                <span className="text-xs md:text-sm text-gray-400 md:text-center mt-1 md:mt-0">
                  {notice.created_at?.substring(0, 10)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
