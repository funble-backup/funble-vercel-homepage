import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { stock_id, price, date } = await request.json();
    if (!stock_id || !price || !date) {
      return NextResponse.json({ error: "종목, 기준가, 기준일을 입력해주세요." }, { status: 400 });
    }
    const db = getDb();
    const result = db
      .prepare("INSERT INTO stock_prices (stock_id, price, end_price, date) VALUES (?, ?, ?, ?)")
      .run(stock_id, price, price, date);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
