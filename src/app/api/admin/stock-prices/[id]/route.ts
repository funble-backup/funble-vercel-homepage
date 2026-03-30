import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { execute } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { stock_id, price, begin_price, end_price, high_price, low_price, deal_qty, date } = await request.json();
    await execute(
      "UPDATE stock_prices SET stock_id = ?, price = ?, begin_price = ?, end_price = ?, high_price = ?, low_price = ?, deal_qty = ?, date = ? WHERE id = ?",
      stock_id, price || 0, begin_price || 0, end_price || 0, high_price || 0, low_price || 0, deal_qty || 0, date, id
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await execute("DELETE FROM stock_prices WHERE id = ?", id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
