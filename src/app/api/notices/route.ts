import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Notice, PaginatedResponse } from "@/types";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const db = getDb();
  const totalCount = (db.prepare("SELECT COUNT(*) as cnt FROM notices").get() as { cnt: number }).cnt;
  const data = db
    .prepare("SELECT * FROM notices ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(PAGE_SIZE, offset) as Notice[];

  const response: PaginatedResponse<Notice> = {
    data,
    hasNext: offset + PAGE_SIZE < totalCount,
    page,
    totalCount,
  };
  return NextResponse.json(response);
}
