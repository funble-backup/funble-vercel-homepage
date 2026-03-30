import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { FaqCategory } from "@/types";

export async function GET() {
  const db = getDb();
  const categories = db
    .prepare("SELECT * FROM faq_categories ORDER BY sort_order ASC")
    .all() as FaqCategory[];
  return NextResponse.json(categories);
}
