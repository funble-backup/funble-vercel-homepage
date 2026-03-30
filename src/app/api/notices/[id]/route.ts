import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Notice } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const notice = db.prepare("SELECT * FROM notices WHERE id = ?").get(Number(id)) as Notice | undefined;

  if (!notice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(notice);
}
