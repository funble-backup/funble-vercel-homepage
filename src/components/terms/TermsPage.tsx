"use client";

import { useEffect, useState } from "react";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

interface TermsPageProps {
  type: "clause" | "service" | "privacy";
  title: string;
}

export default function TermsPage({ type, title }: TermsPageProps) {
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/terms?type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        setVersions(data.versions || []);
        setSelectedVersion(data.version_date || "");
        setContent(data.content || "");
      })
      .finally(() => setLoading(false));
  }, [type]);

  const handleVersionChange = (date: string) => {
    setSelectedVersion(date);
    setLoading(true);
    fetch(`/api/terms?type=${type}&version_date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content || "");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
        {title}
      </h1>

      {versions.length > 0 && (
        <div className="mb-6">
          <select
            value={selectedVersion}
            onChange={(e) => handleVersionChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] pr-10 cursor-pointer min-w-[180px]"
          >
            {versions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-400">로딩 중...</div>
      ) : (
        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      )}
    </div>
  );
}
