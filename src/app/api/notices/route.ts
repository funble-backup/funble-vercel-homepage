import { NextRequest, NextResponse } from "next/server";
import { queryAll, queryOne } from "@/lib/db";
import type { Notice, PaginatedResponse } from "@/types";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const totalCount = (await queryOne<{ cnt: number }>("SELECT COUNT(*) as cnt FROM notices"))!.cnt;
  const data = await queryAll<Notice>("SELECT * FROM notices ORDER BY created_at DESC LIMIT ? OFFSET ?", PAGE_SIZE, offset);

  const response: PaginatedResponse<Notice> = {
    data,
    hasNext: offset + PAGE_SIZE < totalCount,
    page,
    totalCount,
  };
  return NextResponse.json(response);
}
