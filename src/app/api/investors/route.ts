import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Investor } from "@/types";

export async function GET() {
  const db = getDb();
  const investors = db
    .prepare("SELECT * FROM investors WHERE is_active = 1 ORDER BY sort_order ASC")
    .all() as Investor[];
  return NextResponse.json(investors);
}
