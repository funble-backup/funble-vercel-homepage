import { NextRequest, NextResponse } from "next/server";
import { queryAll, queryOne } from "@/lib/db";
import { localizeAnnouncementFileUrlJson } from "@/lib/announcement-pdf-local";
import type { Announcement, PaginatedResponse } from "@/types";

const PAGE_SIZE = 7;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stockId = Number(id);
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const totalCount = (await queryOne<{ cnt: number }>("SELECT COUNT(*) as cnt FROM announcements WHERE stock_id = ?", stockId))!.cnt;
  const data = await queryAll<Announcement>("SELECT * FROM announcements WHERE stock_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?", stockId, PAGE_SIZE, offset);

  const dataWithLocalFiles = data.map((row) => {
    const fu = row.file_url;
    if (typeof fu === "string" && fu.trim() && row.id != null) {
      return {
        ...row,
        file_url: localizeAnnouncementFileUrlJson(row.id, fu),
      };
    }
    return row;
  });

  const response: PaginatedResponse<Announcement> = {
    data: dataWithLocalFiles,
    hasNext: offset + PAGE_SIZE < totalCount,
    page,
    totalCount,
  };
  return NextResponse.json(response);
}
