"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // 현재 페이지 기준 앞뒤 2페이지씩 보여줌
  const range = 2;
  let start = Math.max(1, page - range);
  let end = Math.min(totalPages, page + range);

  // 시작/끝이 잘려도 최소 5개 보이도록 보정
  if (end - start < range * 2) {
    if (start === 1) {
      end = Math.min(totalPages, start + range * 2);
    } else if (end === totalPages) {
      start = Math.max(1, end - range * 2);
    }
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-1 mt-8">
      {/* 이전 */}
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        &lt;
      </button>

      {/* 첫 페이지 */}
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            1
          </button>
          {start > 2 && (
            <span className="w-9 h-9 flex items-center justify-center text-sm text-gray-400">
              ...
            </span>
          )}
        </>
      )}

      {/* 페이지 번호 */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            p === page
              ? "bg-[rgb(35,184,188)] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}

      {/* 마지막 페이지 */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="w-9 h-9 flex items-center justify-center text-sm text-gray-400">
              ...
            </span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 */}
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        &gt;
      </button>
    </div>
  );
}
