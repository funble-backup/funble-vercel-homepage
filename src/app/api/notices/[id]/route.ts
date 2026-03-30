import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import type { Notice } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const notice = await queryOne<Notice>("SELECT * FROM notices WHERE id = ?", Number(id));

  if (!notice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(notice);
}
