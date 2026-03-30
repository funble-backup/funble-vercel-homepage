"use client";

import { FaqCategory } from "@/types";

interface FaqCategoryTabsProps {
  categories: FaqCategory[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function FaqCategoryTabs({
  categories,
  selectedId,
  onSelect,
}: FaqCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-3 justify-center">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-[15px] font-medium transition-colors cursor-pointer ${
            selectedId === cat.id
              ? "text-primary"
              : "text-[#7A7676] hover:text-primary"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
