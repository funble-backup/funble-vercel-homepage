"use client";

import { useEffect, useState } from "react";
import DefaultEditor from "react-simple-wysiwyg";
import type { Stock, Announcement, StockPrice } from "@/types";

type Tab = "stocks" | "announcements" | "prices";

export default function AdminAnnouncePage() {
  const [tab, setTab] = useState<Tab>("stocks");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [prices, setPrices] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<Tab>("stocks");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Forms
  const [stockForm, setStockForm] = useState({ funble_cd: "", funble_nm: "", status: "end", sort_order: 0 });
  const [annForm, setAnnForm] = useState({ stock_id: 0, title: "", category: "", content: "", file_url: "" });
  const [uploading, setUploading] = useState(false);
  const [priceForm, setPriceForm] = useState({ stock_id: 0, price: 0, begin_price: 0, end_price: 0, high_price: 0, low_price: 0, deal_qty: 0, date: "" });

  async function loadAll() {
    setLoading(true);
    try {
      const stockRes = await fetch("/api/stocks");
      const stockData = await stockRes.json();
      setStocks(Array.isArray(stockData) ? stockData : []);

      // Load announcements for all stocks
      if (stockData.length > 0) {
        const allAnn: Announcement[] = [];
        const allPrices: StockPrice[] = [];
        for (const s of stockData.slice(0, 20)) {
          const [annRes, priceRes] = await Promise.all([
            fetch(`/api/stocks/${s.id}/announcements?page=1&limit=100`),
            fetch(`/api/stocks/${s.id}/prices?page=1&limit=100`),
          ]);
          const annData = await annRes.json();
          const priceData = await priceRes.json();
          allAnn.push(...(annData.data || []));
          allPrices.push(...(priceData.data || []));
        }
        setAnnouncements(allAnn);
        setPrices(allPrices);
      }
    } catch {
      /* empty */
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function openCreate(type: Tab) {
    setModalType(type);
    setEditingId(null);
    if (type === "stocks") setStockForm({ funble_cd: "", funble_nm: "", status: "end", sort_order: 0 });
    if (type === "announcements") setAnnForm({ stock_id: stocks[0]?.id || 0, title: "", category: "", content: "", file_url: "" });
    if (type === "prices") setPriceForm({ stock_id: stocks[0]?.id || 0, price: 0, begin_price: 0, end_price: 0, high_price: 0, low_price: 0, deal_qty: 0, date: "" });
    setShowModal(true);
  }

  function openEditStock(s: Stock) {
    setModalType("stocks");
    setEditingId(s.id);
    setStockForm({ funble_cd: s.funble_cd, funble_nm: s.funble_nm, status: s.status, sort_order: s.sort_order });
    setShowModal(true);
  }

  function openEditAnn(a: Announcement) {
    setModalType("announcements");
    setEditingId(a.id);
    setAnnForm({ stock_id: a.stock_id, title: a.title, category: a.category, content: a.content, file_url: a.file_url || "" });
    setShowModal(true);
  }

  function openEditPrice(p: StockPrice) {
    setModalType("prices");
    setEditingId(p.id);
    setPriceForm({ stock_id: p.stock_id, price: p.price, begin_price: p.begin_price || 0, end_price: p.end_price || 0, high_price: p.high_price || 0, low_price: p.low_price || 0, deal_qty: p.deal_qty || 0, date: p.date });
    setShowModal(true);
  }

  async function handleSave() {
    const apiMap = {
      stocks: { url: "/api/admin/stocks", body: stockForm },
      announcements: { url: "/api/admin/announcements", body: annForm },
      prices: { url: "/api/admin/stock-prices", body: priceForm },
    };
    const { url, body } = apiMap[modalType];

    if (editingId) {
      await fetch(`${url}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setShowModal(false);
    loadAll();
  }

  async function handleDelete(type: Tab, id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const urlMap = { stocks: "/api/admin/stocks", announcements: "/api/admin/announcements", prices: "/api/admin/stock-prices" };
    await fetch(`${urlMap[type]}/${id}`, { method: "DELETE" });
    loadAll();
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "stocks", label: "종목 관리" },
    { key: "announcements", label: "공시 관리" },
    { key: "prices", label: "기준가 관리" },
  ];

  function getStockName(stockId: number) {
    return stocks.find((s) => s.id === stockId)?.funble_nm || "-";
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">공시정보 관리</h2>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
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
          {tab === "stocks" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">코드</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">이름</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">상태</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">관리</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{s.funble_cd}</td>
                    <td className="px-4 py-3 text-gray-800">{s.funble_nm}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        s.status === "ing" ? "bg-green-100 text-green-700" :
                        s.status === "expect" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEditStock(s)} className="text-blue-600 hover:underline">수정</button>
                      <button onClick={() => handleDelete("stocks", s.id)} className="text-red-500 hover:underline">삭제</button>
                    </td>
                  </tr>
                ))}
                {stocks.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">종목이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {tab === "announcements" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">종목</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">제목</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">분류</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">날짜</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">첨부</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">관리</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{getStockName(a.stock_id)}</td>
                    <td className="px-4 py-3 text-gray-800">{a.title}</td>
                    <td className="px-4 py-3 text-gray-500">{a.category}</td>
                    <td className="px-4 py-3 text-gray-500">{a.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {a.file_url ? (
                        <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">다운로드</a>
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEditAnn(a)} className="text-blue-600 hover:underline">수정</button>
                      <button onClick={() => handleDelete("announcements", a.id)} className="text-red-500 hover:underline">삭제</button>
                    </td>
                  </tr>
                ))}
                {announcements.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">공시가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {tab === "prices" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">종목</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">기준가</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">시가</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">종가</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">고가</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">저가</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">거래량</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">기준일</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">관리</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{getStockName(p.stock_id)}</td>
                    <td className="px-4 py-3 text-right text-gray-800">{p.price?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{p.begin_price?.toLocaleString() || "-"}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{p.end_price?.toLocaleString() || "-"}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{p.high_price?.toLocaleString() || "-"}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{p.low_price?.toLocaleString() || "-"}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{p.deal_qty?.toLocaleString() || "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{p.date}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEditPrice(p)} className="text-blue-600 hover:underline">수정</button>
                      <button onClick={() => handleDelete("prices", p.id)} className="text-red-500 hover:underline">삭제</button>
                    </td>
                  </tr>
                ))}
                {prices.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">기준가가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingId ? "수정" : "새로 추가"}
            </h3>
            <div className="space-y-3">
              {modalType === "stocks" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">종목 코드</label>
                    <input type="text" value={stockForm.funble_cd} onChange={(e) => setStockForm({ ...stockForm, funble_cd: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">종목 이름</label>
                    <input type="text" value={stockForm.funble_nm} onChange={(e) => setStockForm({ ...stockForm, funble_nm: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <select value={stockForm.status} onChange={(e) => setStockForm({ ...stockForm, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="ing">진행 중 (ing)</option>
                      <option value="expect">예정 (expect)</option>
                      <option value="end">완료 (end)</option>
                    </select>
                  </div>
                </>
              )}
              {modalType === "announcements" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">종목</label>
                    <select value={annForm.stock_id} onChange={(e) => setAnnForm({ ...annForm, stock_id: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {stocks.map((s) => <option key={s.id} value={s.id}>{s.funble_nm}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                    <input type="text" value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">분류</label>
                    <input type="text" value={annForm.category} onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                    <DefaultEditor
                      value={annForm.content}
                      onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                      style={{ minHeight: "200px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">첨부파일</label>
                    {annForm.file_url && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <a href={annForm.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                          {annForm.file_url.split("/").pop()}
                        </a>
                        <button
                          type="button"
                          onClick={() => setAnnForm({ ...annForm, file_url: "" })}
                          className="text-red-500 hover:underline text-xs"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                          const fd = new FormData();
                          fd.append("file", file);
                          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                          if (!res.ok) throw new Error("Upload failed");
                          const data = await res.json();
                          if (data.url) {
                            setAnnForm((prev) => ({ ...prev, file_url: data.url }));
                          }
                        } catch {
                          alert("파일 업로드에 실패했습니다.");
                        }
                        setUploading(false);
                      }}
                      className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && <p className="text-xs text-gray-400 mt-1">업로드 중...</p>}
                  </div>
                </>
              )}
              {modalType === "prices" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">종목</label>
                    <select value={priceForm.stock_id} onChange={(e) => setPriceForm({ ...priceForm, stock_id: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {stocks.map((s) => <option key={s.id} value={s.id}>{s.funble_nm}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">기준일</label>
                    <input type="date" value={priceForm.date} onChange={(e) => setPriceForm({ ...priceForm, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">기준가</label>
                      <input type="number" value={priceForm.price} onChange={(e) => setPriceForm({ ...priceForm, price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">시가</label>
                      <input type="number" value={priceForm.begin_price} onChange={(e) => setPriceForm({ ...priceForm, begin_price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">종가</label>
                      <input type="number" value={priceForm.end_price} onChange={(e) => setPriceForm({ ...priceForm, end_price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">고가</label>
                      <input type="number" value={priceForm.high_price} onChange={(e) => setPriceForm({ ...priceForm, high_price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">저가</label>
                      <input type="number" value={priceForm.low_price} onChange={(e) => setPriceForm({ ...priceForm, low_price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">거래량</label>
                      <input type="number" value={priceForm.deal_qty} onChange={(e) => setPriceForm({ ...priceForm, deal_qty: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </>
              )}
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
