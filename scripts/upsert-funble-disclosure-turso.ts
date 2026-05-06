/**
 * funble.kr 공시(상품 공시) 상세 API에서 데이터를 가져와 Turso announcements에 추가합니다.
 * (announce_detail?type=discloure&id=262 → productdiscloure/262)
 *
 * Usage: npx tsx scripts/upsert-funble-disclosure-turso.ts [disclosureId]
 * Example: npx tsx scripts/upsert-funble-disclosure-turso.ts 262
 *
 * Requires: TURSO_DATABASE_URL, TURSO_DATABASE_TOKEN
 * Prerequisite: 해당 funble_cd 종목이 stocks 테이블에 있어야 합니다 (크롤/마이그레이션 등).
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const BASE = "https://www.funble.kr";

type FileRow = { name: string; url: string; ext: string };

type DisclosureDetailResponse = {
  data?: {
    id: number;
    funbleCd: string;
    disclosureCod?: string;
    disclosureCodKo?: string;
    title: string;
    detail: string;
    createdAt: string;
  };
  fileList?: Array<{ originName?: string; name?: string; url: string; ext?: string }>;
};

async function fetchDisclosure(discId: number): Promise<{
  title: string;
  category: string;
  content: string;
  fileUrl: string;
  createdAt: string;
  funbleCd: string;
}> {
  const url = `${BASE}/api/main/v1/productdiscloure/${discId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const json = (await res.json()) as DisclosureDetailResponse;
  const d = json.data;
  if (!d?.funbleCd || !d.title) {
    throw new Error("Invalid disclosure payload (missing funbleCd/title)");
  }
  const files = json.fileList || [];
  const fileUrl =
    files.length > 0
      ? JSON.stringify(
          files.map((f, i) => ({
            name: f.originName || f.name || `file-${i}`,
            url: f.url,
            ext: f.ext || "",
          })) as FileRow[]
        )
      : "";

  return {
    title: d.title,
    category: d.disclosureCodKo || d.disclosureCod || "",
    content: d.detail || "",
    fileUrl,
    createdAt: d.createdAt,
    funbleCd: d.funbleCd,
  };
}

async function main() {
  const discId = Number(process.argv[2] || 262);
  if (!Number.isFinite(discId)) {
    console.error("Usage: npx tsx scripts/upsert-funble-disclosure-turso.ts <disclosureId>");
    process.exit(1);
  }

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_DATABASE_TOKEN;
  if (!tursoUrl || !tursoToken) {
    console.error("TURSO_DATABASE_URL and TURSO_DATABASE_TOKEN must be set");
    process.exit(1);
  }

  console.log(`Fetching disclosure id=${discId}...`);
  const payload = await fetchDisclosure(discId);

  const turso = createClient({ url: tursoUrl, authToken: tursoToken });
  const row = await turso.execute({
    sql: "SELECT id FROM stocks WHERE funble_cd = ? LIMIT 1",
    args: [payload.funbleCd],
  });
  const stockId = row.rows[0]?.id;
  if (stockId === undefined || stockId === null) {
    console.error(
      `No stock in DB for funble_cd=${payload.funbleCd}. Run stock crawl/migration first.`
    );
    process.exit(1);
  }
  const sid = Number(stockId);

  const dup = await turso.execute({
    sql: "SELECT id FROM announcements WHERE stock_id = ? AND title = ? AND created_at = ? LIMIT 1",
    args: [sid, payload.title, payload.createdAt],
  });
  if (dup.rows.length > 0) {
    console.log(
      `Skip: already exists announcements id=${dup.rows[0].id} (same stock/title/created_at)`
    );
    return;
  }

  await turso.execute({
    sql: `INSERT INTO announcements (stock_id, title, category, content, file_url, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      sid,
      payload.title,
      payload.category,
      payload.content,
      payload.fileUrl,
      payload.createdAt,
    ],
  });

  console.log(
    `OK: inserted announcement for stock_id=${sid} (${payload.funbleCd}) — ${payload.title}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
