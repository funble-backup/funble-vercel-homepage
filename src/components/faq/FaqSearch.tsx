"use client";

interface FaqSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FaqSearch({ value, onChange }: FaqSearchProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="flex items-center bg-[#EFEFEF] rounded-xl px-5 min-h-[3.2rem]">
        <svg
          className="w-5 h-5 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="궁금한 내용을 검색해보세요"
          className="flex-1 bg-transparent border-none outline-none ml-3 text-sm text-gray-800 placeholder:text-gray-400"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
