import { NextResponse } from "next/server";
import { queryAll } from "@/lib/db";
import type { FaqCategory } from "@/types";

export async function GET() {
  const categories = await queryAll<FaqCategory>("SELECT * FROM faq_categories ORDER BY sort_order ASC");
  return NextResponse.json(categories);
}
