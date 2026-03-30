import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/terms?type=clause&version_date=2024.12.05
// type: clause | service | privacy
// version_date 없으면 최신 버전 반환
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");
  const versionDate = searchParams.get("version_date");

  if (!type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }

  const db = getDb();

  // 해당 type의 모든 날짜 목록
  const versions = db
    .prepare("SELECT version_date FROM terms WHERE type = ? ORDER BY version_date DESC")
    .all(type) as { version_date: string }[];

  // 특정 날짜 or 최신 버전 내용
  let content: { id: number; type: string; version_date: string; content: string } | undefined;
  if (versionDate) {
    content = db
      .prepare("SELECT * FROM terms WHERE type = ? AND version_date = ?")
      .get(type, versionDate) as typeof content;
  } else {
    content = db
      .prepare("SELECT * FROM terms WHERE type = ? ORDER BY version_date DESC LIMIT 1")
      .get(type) as typeof content;
  }

  return NextResponse.json({
    versions: versions.map((v) => v.version_date),
    content: content?.content || "",
    version_date: content?.version_date || "",
  });
}
