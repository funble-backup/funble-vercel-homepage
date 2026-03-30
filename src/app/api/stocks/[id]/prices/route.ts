import { NextRequest, NextResponse } from "next/server";
import { queryAll, queryOne } from "@/lib/db";
import type { StockPrice, PaginatedResponse } from "@/types";

const PAGE_SIZE = 20;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stockId = Number(id);
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const totalCount = (await queryOne<{ cnt: number }>("SELECT COUNT(*) as cnt FROM stock_prices WHERE stock_id = ?", stockId))!.cnt;
  const data = await queryAll<StockPrice>("SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date DESC LIMIT ? OFFSET ?", stockId, PAGE_SIZE, offset);

  const response: PaginatedResponse<StockPrice> = {
    data,
    hasNext: offset + PAGE_SIZE < totalCount,
    page,
    totalCount,
  };
  return NextResponse.json(response);
}
