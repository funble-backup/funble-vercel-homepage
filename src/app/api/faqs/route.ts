import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Faq } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categoryId = searchParams.get("category_id");
  const search = searchParams.get("search");

  const db = getDb();
  let query = "SELECT * FROM faqs WHERE 1=1";
  const params: unknown[] = [];

  if (categoryId) {
    query += " AND category_id = ?";
    params.push(Number(categoryId));
  }

  if (search) {
    query += " AND (question LIKE ? OR answer LIKE ?)";
    const term = `%${search}%`;
    params.push(term, term);
  }

  query += " ORDER BY sort_order ASC";
  const faqs = db.prepare(query).all(...params) as Faq[];
  return NextResponse.json(faqs);
}
