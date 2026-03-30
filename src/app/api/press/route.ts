import { NextRequest, NextResponse } from "next/server";
import { queryAll } from "@/lib/db";
import type { Press } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = searchParams.get("limit");

  let query = "SELECT * FROM press ORDER BY notice_at DESC";
  const params: unknown[] = [];

  if (limit) {
    query += " LIMIT ?";
    params.push(Number(limit));
  }

  const press = await queryAll<Press>(query, ...params);
  return NextResponse.json(press);
}
