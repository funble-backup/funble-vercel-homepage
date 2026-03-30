import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Press } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = searchParams.get("limit");

  const db = getDb();
  let query = "SELECT * FROM press ORDER BY notice_at DESC";
  const params: unknown[] = [];

  if (limit) {
    query += " LIMIT ?";
    params.push(Number(limit));
  }

  const press = db.prepare(query).all(...params) as Press[];
  return NextResponse.json(press);
}
