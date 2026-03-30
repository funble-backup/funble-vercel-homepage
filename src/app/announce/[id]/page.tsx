"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface AnnounceDetail {
  id: number;
  stock_id: number;
  title: string;
  category: string;
  content: string;
  file_url: string;
  created_at: string;
  funble_nm?: string;
  funble_cd?: string;
}

interface FileItem {
  name: string;
  url: string;
  ext: string;
}

export default function AnnounceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<AnnounceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/announcements/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
        로딩 중...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">공시 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:underline"
        >
          돌아가기
        </button>
      </div>
    );
  }

  let files: FileItem[] = [];
  try {
    if (data.file_url) {
      files = JSON.parse(data.file_url);
    }
  } catch {
    files = [];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-flex items-center gap-1"
      >
        ← 목록으로
      </button>

      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          {data.category && (
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded font-medium">
              {data.category}
            </span>
          )}
          {data.funble_nm && (
            <span className="text-xs text-gray-400">{data.funble_nm}</span>
          )}
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {data.title}
        </h1>
        <p className="text-sm text-gray-400">
          {data.created_at?.substring(0, 10)}
        </p>
      </div>

      {/* Content */}
      {data.content ? (
        <div
          className="prose max-w-none text-sm text-gray-700 leading-relaxed mb-8"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      ) : (
        <div className="py-8 text-center text-gray-400 text-sm">
          상세 내용이 없습니다.
        </div>
      )}

      {/* Files */}
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

      {/* Bottom nav */}
      <div className="border-t border-gray-200 pt-6">
        <Link
          href="/announce"
          className="inline-block px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          목록으로
        </Link>
      </div>
    </div>
  );
}
