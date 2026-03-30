import { NextResponse } from "next/server";
import { queryAll } from "@/lib/db";
import type { Partner } from "@/types";

export async function GET() {
  const partners = await queryAll<Partner>("SELECT * FROM partners WHERE is_active = 1 ORDER BY sort_order ASC");
  return NextResponse.json(partners);
}
