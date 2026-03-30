import { NextResponse } from "next/server";
import { execute } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { stock_id, title, category, content, file_url } = await request.json();
    if (!stock_id || !title) {
      return NextResponse.json({ error: "종목과 제목을 입력해주세요." }, { status: 400 });
    }
    const result = await execute("INSERT INTO announcements (stock_id, title, category, content, file_url) VALUES (?, ?, ?, ?, ?)",
      stock_id, title, category || "", content || "", file_url || "");
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
