import { NextResponse } from "next/server";
import { execute } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { title, image_url, mobile_image_url, link_url, sort_order, is_active } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
    }
    const result = await execute(
      "INSERT INTO banners (title, image_url, mobile_image_url, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      title, image_url || "", mobile_image_url || "", link_url || "", sort_order || 0, is_active ?? 1
    );
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
