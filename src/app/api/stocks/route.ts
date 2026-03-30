import { NextRequest, NextResponse } from "next/server";
import { queryAll } from "@/lib/db";
import type { Stock } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  let query = "SELECT * FROM stocks";
  const queryParams: unknown[] = [];

  if (status) {
    query += " WHERE status = ?";
    queryParams.push(status);
  }

  query += " ORDER BY sort_order ASC";
  const stocks = await queryAll<Stock>(query, ...queryParams);
  return NextResponse.json(stocks);
}
