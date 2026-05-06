import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { localizeAnnouncementFileUrlJson } from "@/lib/announcement-pdf-local";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const annId = Number(id);
  const row = await queryOne(`
      SELECT a.*, s.funble_nm, s.funble_cd
      FROM announcements a
      JOIN stocks s ON s.id = a.stock_id
      WHERE a.id = ?
    `, annId);

  if (!row) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const fileUrl = row.file_url as string;
  const payload =
    typeof fileUrl === "string" && fileUrl.trim()
      ? { ...row, file_url: localizeAnnouncementFileUrlJson(annId, fileUrl) }
      : row;

  return NextResponse.json(payload);
}
