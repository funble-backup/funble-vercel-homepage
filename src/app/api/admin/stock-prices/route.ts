import { NextResponse } from "next/server";
import { execute } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { stock_id, price, begin_price, end_price, high_price, low_price, deal_qty, date } = await request.json();
    if (!stock_id || !date) {
      return NextResponse.json({ error: "종목과 기준일을 입력해주세요." }, { status: 400 });
    }
    const result = await execute(
      "INSERT INTO stock_prices (stock_id, price, begin_price, end_price, high_price, low_price, deal_qty, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      stock_id, price || 0, begin_price || 0, end_price || 0, high_price || 0, low_price || 0, deal_qty || 0, date
    );
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
