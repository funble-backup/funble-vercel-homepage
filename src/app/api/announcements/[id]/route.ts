import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await queryOne(`
      SELECT a.*, s.funble_nm, s.funble_cd
      FROM announcements a
      JOIN stocks s ON s.id = a.stock_id
      WHERE a.id = ?
    `, Number(id));

  if (!row) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(row);
}
