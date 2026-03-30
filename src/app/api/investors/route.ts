import { NextResponse } from "next/server";
import { queryAll } from "@/lib/db";
import type { Investor } from "@/types";

export async function GET() {
  const investors = await queryAll<Investor>("SELECT * FROM investors WHERE is_active = 1 ORDER BY sort_order ASC");
  return NextResponse.json(investors);
}
