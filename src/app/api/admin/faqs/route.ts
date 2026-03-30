import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { category_id, question, answer, sort_order } = await request.json();
    if (!category_id || !question) {
      return NextResponse.json({ error: "카테고리와 질문을 입력해주세요." }, { status: 400 });
    }
    const db = getDb();
    const result = db
      .prepare("INSERT INTO faqs (category_id, question, answer, sort_order) VALUES (?, ?, ?, ?)")
      .run(category_id, question, answer || "", sort_order || 0);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
