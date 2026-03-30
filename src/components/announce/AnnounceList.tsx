"use client";

import { Announcement } from "@/types";
import Pagination from "@/components/common/Pagination";

interface AnnounceListProps {
  announcements: Announcement[];
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSelectAnnounce: (id: number) => void;
}

export default function AnnounceList({
  announcements,
  page,
  totalPages,
  loading,
  onPageChange,
  onSelectAnnounce,
}: AnnounceListProps) {
  if (!loading && announcements.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        등록된 공시가 없습니다.
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-150 ${loading ? "opacity-40 pointer-events-none" : ""}`}>
      <ul className="divide-y divide-gray-100">
        {announcements.map((ann) => (
          <li key={ann.id} className="py-4 px-2">
            <button
              onClick={() => onSelectAnnounce(ann.id)}
              className="w-full flex items-start gap-3 hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors text-left"
            >
              {ann.category && (
                <span className="shrink-0 mt-0.5 inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                  {ann.category}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{ann.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {ann.created_at?.substring(0, 10)}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
