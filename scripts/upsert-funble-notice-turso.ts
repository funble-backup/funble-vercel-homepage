/**
 * funble.kr 공지 API에서 단일 공지를 가져와 Turso notices에 반영합니다.
 * Usage: npx tsx scripts/upsert-funble-notice-turso.ts [noticeId]
 * Example: npx tsx scripts/upsert-funble-notice-turso.ts 122
 *
 * Requires: TURSO_DATABASE_URL, TURSO_DATABASE_TOKEN in .env
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const BASE = "https://www.funble.kr";

type FunbleNotice = {
  id: number;
  title: string;
  detail: string;
  createdAt: string;
  updatedAt?: string | null;
};

async function fetchNoticeFromApi(noticeId: number): Promise<FunbleNotice | null> {
  let page = 0;
  let hasNext = true;
  while (hasNext) {
    const url = `${BASE}/api/co/v1/support/notices?page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
    const json = (await res.json()) as {
      hasNext?: boolean;
      data?: FunbleNotice[];
    };
    const hit = json.data?.find((n) => n.id === noticeId);
    if (hit) return hit;
    hasNext = json.hasNext === true;
    page++;
  }
  return null;
}

async function main() {
  const noticeId = Number(process.argv[2] || 122);
  if (!Number.isFinite(noticeId)) {
    console.error("Usage: npx tsx scripts/upsert-funble-notice-turso.ts <noticeId>");
    process.exit(1);
  }

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_DATABASE_TOKEN;
  if (!tursoUrl || !tursoToken) {
    console.error("TURSO_DATABASE_URL and TURSO_DATABASE_TOKEN must be set in .env or .env.local");
    process.exit(1);
  }

  console.log(`Fetching funble notice id=${noticeId}...`);
  const item = await fetchNoticeFromApi(noticeId);
  if (!item) {
    console.error(`Notice ${noticeId} not found in API pagination.`);
    process.exit(1);
  }

  const turso = createClient({ url: tursoUrl, authToken: tursoToken });
  const content = item.detail || "";
  const updatedAt = item.updatedAt ?? null;

  await turso.execute({
    sql: `INSERT OR REPLACE INTO notices (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    args: [item.id, item.title, content, item.createdAt, updatedAt],
  });

  console.log(`OK: Turso notices id=${item.id} — ${item.title}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
