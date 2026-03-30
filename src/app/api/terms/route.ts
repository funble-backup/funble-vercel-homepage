import { NextRequest, NextResponse } from "next/server";
import { queryAll, queryOne } from "@/lib/db";

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

  // 해당 type의 모든 날짜 목록
  const versions = await queryAll<{ version_date: string }>("SELECT version_date FROM terms WHERE type = ? ORDER BY version_date DESC", type);

  // 특정 날짜 or 최신 버전 내용
  let content: { id: number; type: string; version_date: string; content: string } | undefined;
  if (versionDate) {
    content = await queryOne<{ id: number; type: string; version_date: string; content: string }>("SELECT * FROM terms WHERE type = ? AND version_date = ?", type, versionDate);
  } else {
    content = await queryOne<{ id: number; type: string; version_date: string; content: string }>("SELECT * FROM terms WHERE type = ? ORDER BY version_date DESC LIMIT 1", type);
  }

  return NextResponse.json({
    versions: versions.map((v) => v.version_date),
    content: content?.content || "",
    version_date: content?.version_date || "",
  });
}
