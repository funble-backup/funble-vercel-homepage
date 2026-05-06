"use client";

import { useEffect, useState } from "react";
import R2Wysiwyg from "@/components/R2Wysiwyg";
import type { Notice } from "@/types";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });

  async function loadNotices() {
    setLoading(true);
    try {
      const res = await fetch("/api/notices?page=1&limit=100");
      const data = await res.json();
      setNotices(data.data || []);
    } catch {
      /* empty */
    }
    setLoading(false);
  }

  useEffect(() => {
    loadNotices();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", content: "" });
    setShowModal(true);
  }

  function openEdit(notice: Notice) {
    setEditing(notice);
    setForm({ title: notice.title, content: notice.content });
    setShowModal(true);
  }

  async function handleSave() {
    if (editing) {
      await fetch(`/api/admin/notices/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    loadNotices();
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
    loadNotices();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">공지사항 관리</h2>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          새 공지 작성
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">제목</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">작성일</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{n.id}</td>
                  <td className="px-4 py-3 text-gray-800">{n.title}</td>
                  <td className="px-4 py-3 text-gray-500">{n.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(n)}
                      className="text-blue-600 hover:underline"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editing ? "공지사항 수정" : "새 공지사항"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <div className="max-h-[60vh] overflow-y-auto rounded-md border border-gray-200">
                  <R2Wysiwyg
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    minHeightPx={240}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
