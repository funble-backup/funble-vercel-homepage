import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Banner } from "@/types";

export async function GET() {
  const db = getDb();
  const banners = db
    .prepare("SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC")
    .all() as Banner[];
  return NextResponse.json(banners);
}
