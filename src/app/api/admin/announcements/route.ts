import { NextResponse } from "next/server";
import { execute } from "@/lib/db";
import {
  downloadMissingPdfsAndLocalize,
  type AnnouncementFileItem,
} from "@/lib/announcement-pdf-local";

export async function POST(request: Request) {
  try {
    const { stock_id, title, category, content, file_url } = await request.json();
    if (!stock_id || !title) {
      return NextResponse.json({ error: "종목과 제목을 입력해주세요." }, { status: 400 });
    }
    const initialFileUrl = file_url || "";
    const result = await execute(
      "INSERT INTO announcements (stock_id, title, category, content, file_url) VALUES (?, ?, ?, ?, ?)",
      stock_id,
      title,
      category || "",
      content || "",
      initialFileUrl
    );
    const newId = Number(result.lastInsertRowid);
    try {
      const items = JSON.parse(initialFileUrl) as AnnouncementFileItem[];
      if (Array.isArray(items) && items.length > 0 && newId) {
        const localized = await downloadMissingPdfsAndLocalize(newId, items);
        await execute(
          "UPDATE announcements SET file_url = ? WHERE id = ?",
          JSON.stringify(localized),
          newId
        );
      }
    } catch {
      /* file_url is not a JSON attachment list (e.g. single /uploads/... path) */
    }
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
