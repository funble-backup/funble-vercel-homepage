"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Stock,
  Announcement,
  StockPrice,
  PaginatedResponse,
} from "@/types";
import StockFilter from "@/components/announce/StockFilter";
import AnnounceList from "@/components/announce/AnnounceList";
import PriceList from "@/components/announce/PriceList";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

type Tab = "announce" | "price";

interface AnnounceDetail {
  id: number;
  title: string;
  category: string;
  content: string;
  file_url: string;
  created_at: string;
  funble_nm?: string;
}

interface FileItem {
  name: string;
  url: string;
  ext: string;
}

export default function AnnouncePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">로딩 중...</div>}>
      <AnnounceContent />
    </Suspense>
  );
}

function AnnounceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlId = searchParams.get("id");
  const urlStock = searchParams.get("stock");

  const [tab, setTab] = useState<Tab>("announce");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // URL ?stock= 과 선택 종목 동기화 (뒤로/앞으로, 직접 주소 변경)
  useEffect(() => {
    if (!initializedFromUrl || stocks.length === 0) return;
    if (!urlStock) return;
    const sid = Number(urlStock);
    if (!Number.isFinite(sid)) return;
    if (!stocks.some((s) => s.id === sid)) return;
    setSelectedStockId((prev) => (prev === sid ? prev : sid));
  }, [urlStock, initializedFromUrl, stocks]);

  // Announce state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annPage, setAnnPage] = useState(1);
  const [annTotalPages, setAnnTotalPages] = useState(1);
  const [annLoading, setAnnLoading] = useState(false);

  // Detail state
  const [detail, setDetail] = useState<AnnounceDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Price state
  const [prices, setPrices] = useState<StockPrice[]>([]);
  const [pricePage, setPricePage] = useState(1);
  const [priceTotalPages, setPriceTotalPages] = useState(1);
  const [priceLoading, setPriceLoading] = useState(false);

  // Fetch stocks
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/stocks");
        if (!res.ok) throw new Error("Failed");
        const data: Stock[] = await res.json();
        setStocks(data);
        // Restore stock from URL, or default to first
        const fromUrl = urlStock ? data.find((s) => s.id === Number(urlStock)) : null;
        if (fromUrl) {
          setSelectedStockId(fromUrl.id);
        } else if (data.length > 0) {
          setSelectedStockId(data[0].id);
        }
        setInitializedFromUrl(true);
      } catch {
        setStocks([]);
        setInitializedFromUrl(true);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAnnouncements = useCallback(
    async (stockId: number, page: number) => {
      setAnnLoading(true);
      try {
        const res = await fetch(
          `/api/stocks/${stockId}/announcements?page=${page}`
        );
        if (!res.ok) throw new Error("Failed");
        const data: PaginatedResponse<Announcement> = await res.json();
        setAnnouncements(data.data);
        setAnnPage(data.page);
        setAnnTotalPages(Math.ceil((data.totalCount ?? 0) / 20));
      } catch {
        setAnnouncements([]);
      } finally {
        setAnnLoading(false);
      }
    },
    []
  );

  const fetchPrices = useCallback(
    async (stockId: number, page: number) => {
      setPriceLoading(true);
      try {
        const res = await fetch(
          `/api/stocks/${stockId}/prices?page=${page}`
        );
        if (!res.ok) throw new Error("Failed");
        const data: PaginatedResponse<StockPrice> = await res.json();
        setPrices(data.data);
        setPricePage(data.page);
        setPriceTotalPages(Math.ceil((data.totalCount ?? 0) / 20));
      } catch {
        setPrices([]);
      } finally {
        setPriceLoading(false);
      }
    },
    []
  );

  const buildUrl = useCallback((stockId: number | null, annId?: number | null) => {
    const params = new URLSearchParams();
    if (stockId) params.set("stock", String(stockId));
    if (annId) params.set("id", String(annId));
    const qs = params.toString();
    return qs ? `/announce?${qs}` : "/announce";
  }, []);

  /** 상세는 URL ?id= 만 바꾸고, 실제 로드는 아래 useEffect(urlId)가 담당 (뒤로가기와 동일한 흐름) */
  const openAnnounceDetail = useCallback(
    (annId: number) => {
      router.push(buildUrl(selectedStockId, annId), { scroll: false });
    },
    [router, selectedStockId, buildUrl]
  );

  const clearDetail = useCallback(() => {
    setDetail(null);
    router.push(buildUrl(selectedStockId), { scroll: false });
  }, [router, selectedStockId, buildUrl]);

  // URL ?id= 와 상세 뷰 동기화 (브라우저 뒤로/앞으로, 북마크 진입, 목록에서 클릭)
  useEffect(() => {
    if (!initializedFromUrl) return;

    if (!urlId) {
      setDetail(null);
      setDetailLoading(false);
      return;
    }

    const idNum = Number(urlId);
    if (!Number.isFinite(idNum)) return;

    let cancelled = false;
    setDetailLoading(true);
    fetch(`/api/announcements/${idNum}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: AnnounceDetail) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => {
        if (!cancelled) setDetail(null);
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [urlId, initializedFromUrl]);

  // Fetch list data when stock or tab changes (only when not viewing detail)
  useEffect(() => {
    if (!selectedStockId || detail) return;
    if (tab === "announce") {
      fetchAnnouncements(selectedStockId, 1);
    } else {
      fetchPrices(selectedStockId, 1);
    }
  }, [selectedStockId, tab, detail, fetchAnnouncements, fetchPrices]);

  const handleSelectStock = (id: number) => {
    setSelectedStockId(id);
    setShowSidebar(false);
    setDetail(null);
    router.replace(buildUrl(id), { scroll: false });
  };

  let files: FileItem[] = [];
  if (detail?.file_url) {
    try {
      files = JSON.parse(detail.file_url);
    } catch {
      files = [];
    }
  }

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => { setTab("announce"); clearDetail(); }}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "announce"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            공시
          </button>
          <button
            onClick={() => { setTab("price"); clearDetail(); }}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "price"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            기준가
          </button>
        </div>

        {/* Mobile stock selector */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
          >
            {stocks.find((s) => s.id === selectedStockId)?.funble_nm ||
              "종목 선택"}
            <span className="float-right text-gray-400">
              {showSidebar ? "▲" : "▼"}
            </span>
          </button>
          {showSidebar && (
            <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
              <StockFilter
                stocks={stocks}
                selectedStockId={selectedStockId}
                onSelectStock={handleSelectStock}
              />
            </div>
          )}
        </div>

        {/* Desktop layout */}
        <div className="flex gap-6">
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-20 bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-bold text-gray-800 mb-3">종목</h2>
              <StockFilter
                stocks={stocks}
                selectedStockId={selectedStockId}
                onSelectStock={handleSelectStock}
              />
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {!selectedStockId ? (
              <div className="py-12 text-center text-gray-400">
                종목을 선택해주세요.
              </div>
            ) : detail ? (
              /* Detail View */
              detailLoading ? (
                <div className="py-12 text-center text-gray-400">로딩 중...</div>
              ) : (
                <div>
                  <button
                    onClick={() => clearDetail()}
                    className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-flex items-center gap-1"
                  >
                    ← 목록으로
                  </button>

                  <div className="border-b-2 border-gray-800 pb-6 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      {detail.category && (
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded font-medium">
                          {detail.category}
                        </span>
                      )}
                      {detail.funble_nm && (
                        <span className="text-xs text-gray-400">{detail.funble_nm}</span>
                      )}
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      {detail.title}
                    </h1>
                    <p className="text-sm text-gray-400">
                      {detail.created_at?.substring(0, 10)}
                    </p>
                  </div>

                  {detail.content ? (
                    <div
                      className="prose max-w-none text-sm text-gray-700 leading-relaxed mb-8"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(detail.content) }}
                    />
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-sm">
                      상세 내용이 없습니다.
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="border-t border-gray-200 pt-6 mb-8">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">첨부파일</h3>
                      <ul className="space-y-2">
                        {files.map((file, i) => (
                          <li key={i}>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-gray-900 hover:underline"
                            >
                              <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded uppercase">
                                {file.ext}
                              </span>
                              {file.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            ) : tab === "announce" ? (
              <AnnounceList
                announcements={announcements}
                page={annPage}
                totalPages={annTotalPages}
                loading={annLoading}
                onPageChange={(p) => fetchAnnouncements(selectedStockId, p)}
                onSelectAnnounce={(id) => openAnnounceDetail(id)}
              />
            ) : (
              <PriceList
                prices={prices}
                page={pricePage}
                totalPages={priceTotalPages}
                loading={priceLoading}
                onPageChange={(p) => fetchPrices(selectedStockId, p)}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
