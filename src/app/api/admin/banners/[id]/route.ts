import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { execute } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, image_url, mobile_image_url, link_url, sort_order, is_active } = await request.json();
    await execute(
      "UPDATE banners SET title = ?, image_url = ?, mobile_image_url = ?, link_url = ?, sort_order = ?, is_active = ? WHERE id = ?",
      title, image_url || "", mobile_image_url || "", link_url || "", sort_order || 0, is_active ?? 1, id
    );
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
    await execute("DELETE FROM banners WHERE id = ?", id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
