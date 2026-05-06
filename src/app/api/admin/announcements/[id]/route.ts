import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { execute } from "@/lib/db";
import {
  downloadMissingPdfsAndLocalize,
  type AnnouncementFileItem,
} from "@/lib/announcement-pdf-local";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { stock_id, title, category, content, file_url } = await request.json();
    const annId = Number(id);
    let storedFileUrl = file_url || "";
    try {
      const items = JSON.parse(storedFileUrl) as AnnouncementFileItem[];
      if (Array.isArray(items) && items.length > 0 && annId) {
        const localized = await downloadMissingPdfsAndLocalize(annId, items);
        storedFileUrl = JSON.stringify(localized);
      }
    } catch {
      /* not JSON attachment list */
    }
    await execute(
      "UPDATE announcements SET stock_id = ?, title = ?, category = ?, content = ?, file_url = ? WHERE id = ?",
      stock_id,
      title,
      category,
      content,
      storedFileUrl,
      id
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
    await execute("DELETE FROM announcements WHERE id = ?", id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
