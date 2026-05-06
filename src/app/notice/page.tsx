"use client";

import { useState, useEffect, useCallback } from "react";
import { Notice, PaginatedResponse } from "@/types";
import NoticeList from "@/components/notice/NoticeList";

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchNotices = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notices?page=${p}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: PaginatedResponse<Notice> = await res.json();
      setNotices(data.data);
      setPage(data.page);
      const pageSize = 10;
      setTotalPages(Math.ceil((data.totalCount ?? 0) / pageSize));
    } catch {
      setNotices([]);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices(1);
  }, [fetchNotices]);

  const handlePageChange = (p: number) => {
    fetchNotices(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <section className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
        {initialLoading ? (
          <div className="py-20 text-center text-gray-400">로딩 중...</div>
        ) : (
          <NoticeList
            notices={notices}
            page={page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  );
}
