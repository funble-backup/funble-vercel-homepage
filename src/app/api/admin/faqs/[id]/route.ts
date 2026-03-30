import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { execute } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { category_id, question, answer, sort_order } = await request.json();
    await execute(
      "UPDATE faqs SET category_id = ?, question = ?, answer = ?, sort_order = ? WHERE id = ?",
      category_id, question, answer, sort_order || 0, id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await execute("DELETE FROM faqs WHERE id = ?", id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
