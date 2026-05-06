"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Banner } from "@/types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    image_url: "",
    mobile_image_url: "",
    link_url: "",
    sort_order: 0,
    is_active: 1,
  });

  async function loadBanners() {
    setLoading(true);
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch {
      /* empty */
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBanners();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", image_url: "", mobile_image_url: "", link_url: "", sort_order: 0, is_active: 1 });
    setShowModal(true);
  }

  function openEdit(b: Banner) {
    setEditing(b);
    setForm({
      title: b.title,
      image_url: b.image_url,
      mobile_image_url: b.mobile_image_url || "",
      link_url: b.link_url,
      sort_order: b.sort_order,
      is_active: b.is_active,
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (editing) {
      await fetch(`/api/admin/banners/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    loadBanners();
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    loadBanners();
  }

  async function uploadImage(file: File, field: "image_url" | "mobile_image_url") {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, [field]: data.url }));
      }
    } catch {
      alert("이미지 업로드에 실패했습니다.");
    }
    setUploading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">메인배너 관리</h2>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          새 배너 추가
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : (
        <div className="grid gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start gap-4">
                <div className="flex gap-3 flex-shrink-0">
                  {b.image_url && (
                    <div className="relative w-40 h-20 rounded overflow-hidden border border-gray-200">
                      <Image src={b.image_url} alt={b.title} fill sizes="160px" className="object-cover" />
                      <span className="absolute bottom-0 left-0 bg-black/60 text-white text-[10px] px-1">PC</span>
                    </div>
                  )}
                  {b.mobile_image_url && (
                    <div className="relative w-20 h-20 rounded overflow-hidden border border-gray-200">
                      <Image src={b.mobile_image_url} alt={b.title} fill sizes="80px" className="object-cover" />
                      <span className="absolute bottom-0 left-0 bg-black/60 text-white text-[10px] px-1">Mobile</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800">{b.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    링크: {b.link_url || "(없음)"}
                  </p>
                  <p className="text-xs text-gray-400">
                    정렬: {b.sort_order} | 상태: {b.is_active ? "활성" : "비활성"}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(b)} className="text-blue-600 hover:underline text-sm">수정</button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:underline text-sm">삭제</button>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <p className="text-center text-gray-400 py-8">등록된 배너가 없습니다.</p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editing ? "배너 수정" : "새 배너 추가"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배너 제목</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="배너 제목 (관리용)"
                />
              </div>

              {/* PC 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PC 이미지</label>
                {form.image_url && (
                  <div className="relative w-full h-32 mb-2 rounded overflow-hidden border border-gray-200">
                    <Image src={form.image_url} alt="PC 배너" fill sizes="512px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: "" })}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                    >
                      삭제
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file, "image_url");
                  }}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* 모바일 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">모바일 이미지</label>
                {form.mobile_image_url && (
                  <div className="relative w-40 h-32 mb-2 rounded overflow-hidden border border-gray-200">
                    <Image src={form.mobile_image_url} alt="모바일 배너" fill sizes="160px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, mobile_image_url: "" })}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                    >
                      삭제
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file, "mobile_image_url");
                  }}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {uploading && <p className="text-xs text-gray-400">업로드 중...</p>}

              {/* 이동 링크 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">클릭 시 이동할 링크</label>
                <input
                  type="text"
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com 또는 /page"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                  <select
                    value={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>활성</option>
                    <option value={0}>비활성</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">취소</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
