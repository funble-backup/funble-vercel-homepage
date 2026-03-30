import { NextResponse } from "next/server";
import { execute } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { funble_cd, funble_nm, status, sort_order } = await request.json();
    if (!funble_cd || !funble_nm) {
      return NextResponse.json({ error: "종목 코드와 이름을 입력해주세요." }, { status: 400 });
    }
    const result = await execute("INSERT INTO stocks (funble_cd, funble_nm, status, sort_order) VALUES (?, ?, ?, ?)",
      funble_cd, funble_nm, status || "end", sort_order || 0);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "오류가 발생했습니다." }, { status: 500 });
  }
}
