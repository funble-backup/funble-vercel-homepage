"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NoticeDetail from "@/components/notice/NoticeDetail";
import type { Notice } from "@/types";

export default function NoticeDetailPage() {
  const params = useParams();
  const rawId = params.id;
  const id = typeof rawId === "string" ? Number(rawId) : Number(Array.isArray(rawId) ? rawId[0] : NaN);

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(id) || id < 1) {
      setNotice(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) throw new Error("not found");
        const data: Notice = await res.json();
        if (!cancelled) setNotice(data);
      } catch {
        if (!cancelled) setNotice(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
        <div className="py-20 text-center text-gray-400">로딩 중...</div>
      </section>
    );
  }

  if (!notice) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
        <div className="py-20 text-center text-gray-500">
          <p className="mb-4">공지사항을 찾을 수 없습니다.</p>
          <Link href="/notice" className="text-primary underline">
            목록으로
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <NoticeDetail notice={notice} />
    </section>
  );
}
