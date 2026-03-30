import { NextResponse } from "next/server";
import { queryAll } from "@/lib/db";
import type { Banner } from "@/types";

export async function GET() {
  const banners = await queryAll<Banner>("SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC");
  return NextResponse.json(banners);
}
