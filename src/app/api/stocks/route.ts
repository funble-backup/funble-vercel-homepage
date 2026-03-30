import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Stock } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  const db = getDb();
  let query = "SELECT * FROM stocks";
  const queryParams: unknown[] = [];

  if (status) {
    query += " WHERE status = ?";
    queryParams.push(status);
  }

  query += " ORDER BY sort_order ASC";
  const stocks = db.prepare(query).all(...queryParams) as Stock[];
  return NextResponse.json(stocks);
}
