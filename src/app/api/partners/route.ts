import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Partner } from "@/types";

export async function GET() {
  const db = getDb();
  const partners = db
    .prepare("SELECT * FROM partners WHERE is_active = 1 ORDER BY sort_order ASC")
    .all() as Partner[];
  return NextResponse.json(partners);
}
