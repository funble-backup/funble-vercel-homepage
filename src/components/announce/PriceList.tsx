"use client";

import { StockPrice } from "@/types";
import Pagination from "@/components/common/Pagination";

interface PriceListProps {
  prices: StockPrice[];
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function PriceList({
  prices,
  page,
  totalPages,
  loading,
  onPageChange,
}: PriceListProps) {
  if (!loading && prices.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        등록된 기준가 정보가 없습니다.
      </div>
    );
  }

  const fmt = (n?: number) =>
    n != null ? n.toLocaleString("ko-KR") : "-";

  return (
    <div className={`transition-opacity duration-150 ${loading ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-800 text-gray-500">
              <th className="py-3 px-2 text-center font-medium">날짜</th>
              <th className="py-3 px-2 text-right font-medium">기준가</th>
              <th className="py-3 px-2 text-right font-medium">시가</th>
              <th className="py-3 px-2 text-right font-medium">종가</th>
              <th className="py-3 px-2 text-right font-medium">고가</th>
              <th className="py-3 px-2 text-right font-medium">저가</th>
              <th className="py-3 px-2 text-right font-medium">거래량</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {prices.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3 px-2 text-center text-gray-600">
                  {p.date}
                </td>
                <td className="py-3 px-2 text-right">{fmt(p.price)}</td>
                <td className="py-3 px-2 text-right">
                  {fmt(p.begin_price)}
                </td>
                <td className="py-3 px-2 text-right">
                  {fmt(p.end_price)}
                </td>
                <td className="py-3 px-2 text-right text-red-500">
                  {fmt(p.high_price)}
                </td>
                <td className="py-3 px-2 text-right text-blue-500">
                  {fmt(p.low_price)}
                </td>
                <td className="py-3 px-2 text-right">{fmt(p.deal_qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
