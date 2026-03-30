import { NextResponse } from "next/server";

export async function GET() {
  const isTurso = !!process.env.TURSO_DATABASE_URL;
  return NextResponse.json({
    db: isTurso ? "turso" : "sqlite",
    env: isTurso ? "PRD" : "DEV",
  });
}
