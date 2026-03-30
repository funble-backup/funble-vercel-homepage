"use client";

import { Stock } from "@/types";

interface StockFilterProps {
  stocks: Stock[];
  selectedStockId: number | null;
  onSelectStock: (id: number) => void;
}

const STATUS_LABELS: Record<string, string> = {
  ing: "진행중",
  expect: "예정",
  end: "완료",
};

const STATUS_ORDER = ["ing", "expect", "end"];

export default function StockFilter({
  stocks,
  selectedStockId,
  onSelectStock,
}: StockFilterProps) {
  const grouped = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    items: stocks.filter((s) => s.status === status),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      {grouped.map((group) => (
        <div key={group.status}>
          {grouped.length > 1 && (
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
              {group.label}
            </h3>
          )}
          <ul className="space-y-1">
            {group.items.map((stock) => (
              <li key={stock.id}>
                <button
                  onClick={() => onSelectStock(stock.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors outline-none ${
                    selectedStockId === stock.id
                      ? "bg-primary text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {stock.funble_nm}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {stocks.length === 0 && (
        <div className="text-sm text-gray-400 text-center py-4">
          종목 정보가 없습니다.
        </div>
      )}
    </div>
  );
}
