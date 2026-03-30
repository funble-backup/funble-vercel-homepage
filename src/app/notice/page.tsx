"use client";

import { useState, useEffect, useCallback } from "react";
import { Notice, PaginatedResponse } from "@/types";
import NoticeList from "@/components/notice/NoticeList";
import NoticeDetail from "@/components/notice/NoticeDetail";

export default function NoticePage() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
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

  const fetchNoticeDetail = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/notices/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Notice = await res.json();
      setSelectedNotice(data);
      setView("detail");
    } catch {
      setSelectedNotice(null);
    }
  }, []);

  useEffect(() => {
    fetchNotices(1);
  }, [fetchNotices]);

  const handleSelectNotice = (id: number) => {
    fetchNoticeDetail(id);
  };

  const handleBack = () => {
    setView("list");
    setSelectedNotice(null);
  };

  const handlePageChange = (p: number) => {
    fetchNotices(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
{/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
        {initialLoading ? (
          <div className="py-20 text-center text-gray-400">
            로딩 중...
          </div>
        ) : view === "list" ? (
          <NoticeList
            notices={notices}
            page={page}
            totalPages={totalPages}
            loading={loading}
            onSelectNotice={handleSelectNotice}
            onPageChange={handlePageChange}
          />
        ) : selectedNotice ? (
          <NoticeDetail notice={selectedNotice} onBack={handleBack} />
        ) : null}
      </section>
    </div>
  );
}
