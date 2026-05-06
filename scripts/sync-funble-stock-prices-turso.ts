/**
 * funble.kr 일별 시세 API를 Turso stock_prices에 반영합니다 (해당 종목 전체 페이지).
 * 기존 해당 stock_id 행은 삭제 후 API 데이터로 다시 채웁니다.
 *
 * Usage: npx tsx scripts/sync-funble-stock-prices-turso.ts [funbleCd]
 * Example: npx tsx scripts/sync-funble-stock-prices-turso.ts FB2409311
 *
 * Requires: TURSO_DATABASE_URL, TURSO_DATABASE_TOKEN
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const BASE = "https://www.funble.kr";

type DailyQuoteItem = {
  stockPriceId?: { funbleCd?: string; at?: number[] };
  dealStdPrice?: number;
  beginPrice?: number;
  endPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  dealQty?: number;
};

function dateStrFromItem(item: DailyQuoteItem): string {
  const dateArr = item.stockPriceId?.at || [];
  if (dateArr.length !== 3) return "";
  return `${dateArr[0]}-${String(dateArr[1]).padStart(2, "0")}-${String(dateArr[2]).padStart(2, "0")}`;
}

async function fetchJson(path: string): Promise<{ data?: DailyQuoteItem[]; hasNext?: boolean }> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function main() {
  const funbleCd = (process.argv[2] || "FB2409311").trim();
  if (!funbleCd) {
    console.error("Usage: npx tsx scripts/sync-funble-stock-prices-turso.ts <funbleCd>");
    process.exit(1);
  }

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_DATABASE_TOKEN;
  if (!tursoUrl || !tursoToken) {
    console.error("TURSO_DATABASE_URL and TURSO_DATABASE_TOKEN must be set");
    process.exit(1);
  }

  const turso = createClient({ url: tursoUrl, authToken: tursoToken });
  const stockRes = await turso.execute({
    sql: "SELECT id FROM stocks WHERE funble_cd = ? LIMIT 1",
    args: [funbleCd],
  });
  const stockIdRaw = stockRes.rows[0]?.id;
  if (stockIdRaw === undefined || stockIdRaw === null) {
    console.error(`No stock in DB for funble_cd=${funbleCd}`);
    process.exit(1);
  }
  const stockId = Number(stockIdRaw);

  console.log(`Fetching daily quotes for ${funbleCd} (stock_id=${stockId})...`);
  const rows: Array<{
    stock_id: number;
    price: number;
    begin_price: number;
    end_price: number;
    high_price: number;
    low_price: number;
    deal_qty: number;
    date: string;
  }> = [];

  let page = 0;
  let hasNext = true;
  while (hasNext) {
    const data = await fetchJson(`/api/main/v1/stock/dailyQuote/${funbleCd}?page=${page}`);
    const items = data.data || [];
    for (const item of items) {
      const d = dateStrFromItem(item);
      if (!d) continue;
      rows.push({
        stock_id: stockId,
        price: item.dealStdPrice ?? 0,
        begin_price: item.beginPrice ?? 0,
        end_price: item.endPrice ?? 0,
        high_price: item.highPrice ?? 0,
        low_price: item.lowPrice ?? 0,
        deal_qty: item.dealQty ?? 0,
        date: d,
      });
    }
    hasNext = data.hasNext === true;
    page++;
  }

  await turso.execute({
    sql: "DELETE FROM stock_prices WHERE stock_id = ?",
    args: [stockId],
  });

  const insertSql = `INSERT INTO stock_prices (stock_id, price, begin_price, end_price, high_price, low_price, deal_qty, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const CHUNK = 80;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const statements = chunk.map((r) => ({
      sql: insertSql,
      args: [
        r.stock_id,
        r.price,
        r.begin_price,
        r.end_price,
        r.high_price,
        r.low_price,
        r.deal_qty,
        r.date,
      ],
    }));
    await turso.batch(statements);
  }

  const latest = rows.length > 0 ? rows[0] : null;
  console.log(`OK: ${rows.length} rows for ${funbleCd}. Latest date in first page: ${latest?.date ?? "(none)"}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
