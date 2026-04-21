import { NextResponse } from "next/server";
import { execute } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { category_id, question, answer } = await request.json();
    if (!category_id || !question) {
      return NextResponse.json({ error: "카테고리와 질문을 입력해주세요." }, { status: 400 });
    }
    const result = await execute("INSERT INTO faqs (category_id, question, answer) VALUES (?, ?, ?)",
      category_id, question, answer || "");
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
