import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, code, sort_order } = await request.json();
    if (!name || !code) {
      return NextResponse.json({ error: "카테고리명과 코드를 입력해주세요." }, { status: 400 });
    }
    const db = getDb();
    const result = db
      .prepare("INSERT INTO faq_categories (name, code, sort_order) VALUES (?, ?, ?)")
      .run(name, code, sort_order || 0);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
