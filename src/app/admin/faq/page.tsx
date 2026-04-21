"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DefaultEditor from "react-simple-wysiwyg";
import type { FaqCategory, Faq } from "@/types";

type Tab = "categories" | "faqs";

function tabFromSearchParam(raw: string | null): Tab {
  if (raw === "faqs") return "faqs";
  return "categories";
}

export default function AdminFaqPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">로딩 중...</p>}>
      <AdminFaqContent />
    </Suspense>
  );
}

function AdminFaqContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = tabFromSearchParam(searchParams.get("tab"));

  const setTab = useCallback(
    (next: Tab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "categories") {
        params.delete("tab");
      } else {
        params.set("tab", "faqs");
      }
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<Tab>("categories");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [catForm, setCatForm] = useState({ name: "", code: "", sort_order: 0 });
  const [faqForm, setFaqForm] = useState({ category_id: 0, question: "", answer: "" });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, faqRes] = await Promise.all([
        fetch("/api/faq-categories"),
        fetch("/api/faqs"),
      ]);
      const catData = await catRes.json();
      const faqData = await faqRes.json();
      setCategories(Array.isArray(catData) ? catData : []);
      setFaqs(Array.isArray(faqData) ? faqData : []);
    } catch {
      /* empty */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Avoid synchronous setState inside effect body (eslint rule in this repo)
    const t = setTimeout(() => {
      void loadAll();
    }, 0);
    return () => clearTimeout(t);
  }, [loadAll]);

  function getCategoryName(catId: number) {
    return categories.find((c) => c.id === catId)?.name || "-";
  }

  function openCreate(type: Tab) {
    setModalType(type);
    setEditingId(null);
    if (type === "categories") setCatForm({ name: "", code: "", sort_order: 0 });
    if (type === "faqs") setFaqForm({ category_id: categories[0]?.id || 0, question: "", answer: "" });
    setShowModal(true);
  }

  function openEditCat(c: FaqCategory) {
    setModalType("categories");
    setEditingId(c.id);
    setCatForm({ name: c.name, code: c.code, sort_order: c.sort_order });
    setShowModal(true);
  }

  function openEditFaq(f: Faq) {
    setModalType("faqs");
    setEditingId(f.id);
    setFaqForm({ category_id: f.category_id, question: f.question, answer: f.answer });
    setShowModal(true);
  }

  async function handleSave() {
    if (modalType === "categories") {
      const url = editingId ? `/api/admin/faq-categories/${editingId}` : "/api/admin/faq-categories";
      await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catForm),
      });
    } else {
      const url = editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs";
      await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqForm),
      });
    }
    setShowModal(false);
    loadAll();
  }

  async function handleDelete(type: Tab, id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const url = type === "categories" ? `/api/admin/faq-categories/${id}` : `/api/admin/faqs/${id}`;
    await fetch(url, { method: "DELETE" });
    loadAll();
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">FAQ 관리</h2>

      <div className="flex gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => setTab("categories")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "categories" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          카테고리
        </button>
        <button
          onClick={() => setTab("faqs")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "faqs" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          FAQ 항목
        </button>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => openCreate(tab)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          새로 추가
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {tab === "categories" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">카테고리명</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">코드</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">정렬</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">관리</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{c.id}</td>
                    <td className="px-4 py-3 text-gray-800">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.code}</td>
                    <td className="px-4 py-3 text-gray-500">{c.sort_order}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEditCat(c)} className="text-blue-600 hover:underline">수정</button>
                      <button onClick={() => handleDelete("categories", c.id)} className="text-red-500 hover:underline">삭제</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">카테고리가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {tab === "faqs" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">카테고리</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">질문</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">관리</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((f) => (
                  <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{getCategoryName(f.category_id)}</td>
                    <td className="px-4 py-3 text-gray-800">{f.question}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEditFaq(f)} className="text-blue-600 hover:underline">수정</button>
                      <button onClick={() => handleDelete("faqs", f.id)} className="text-red-500 hover:underline">삭제</button>
                    </td>
                  </tr>
                ))}
                {faqs.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">FAQ가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className={`bg-white rounded-lg shadow-lg w-full mx-auto flex flex-col max-h-[min(90vh,900px)] ${
              modalType === "faqs" ? "max-w-3xl" : "max-w-lg"
            }`}
          >
            <h3 className="text-lg font-bold text-gray-800 px-6 pt-6 pb-2 shrink-0 border-b border-gray-100">
              {editingId ? "수정" : "새로 추가"}
            </h3>
            <div className="space-y-3 px-6 py-4 overflow-y-auto min-h-0 flex-1">
              {modalType === "categories" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">카테고리명</label>
                    <input type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">코드</label>
                    <input type="text" value={catForm.code} onChange={(e) => setCatForm({ ...catForm, code: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                    <input type="number" value={catForm.sort_order} onChange={(e) => setCatForm({ ...catForm, sort_order: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </>
              )}
              {modalType === "faqs" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">질문</label>
                    <input type="text" value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                    <select
                      value={faqForm.category_id}
                      onChange={(e) => setFaqForm({ ...faqForm, category_id: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={categories.length === 0}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">답변</label>
                    {/* rsw-editor에 max-height를 주면 툴바는 고정되고 .rsw-ce 영역만 스크롤됨 */}
                    <div className="[&_.rsw-editor]:max-h-[min(50vh,420px)] [&_.rsw-editor]:min-h-[200px] [&_.rsw-ce]:min-h-0">
                      <DefaultEditor
                        value={faqForm.answer}
                        onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0 rounded-b-lg">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">취소</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
