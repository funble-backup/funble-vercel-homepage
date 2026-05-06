/**
 * funble.kr 일별 시세 API를 Turso stock_prices에 반영합니다.
 * API: GET /api/main/v1/stock/dailyQuote/{funbleCd}?size=1000&page=0
 * (size로 한 번에 많이 받고, hasNext면 page 증가)
 *
 * Usage:
 *   npx tsx scripts/sync-funble-stock-prices-turso.ts FB2409311
 *   npx tsx scripts/sync-funble-stock-prices-turso.ts FB2409311 FB2212211
 *
 * Requires: TURSO_DATABASE_URL, TURSO_DATABASE_TOKEN
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const BASE = "https://www.funble.kr";
/** funble API — 한 페이지 최대 건수 (기본 20 대신 1000) */
const QUOTE_PAGE_SIZE = 1000;

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

async function fetchAllDailyQuotes(funbleCd: string): Promise<DailyQuoteItem[]> {
  const all: DailyQuoteItem[] = [];
  let page = 0;
  let hasNext = true;
  while (hasNext) {
    const data = await fetchJson(
      `/api/main/v1/stock/dailyQuote/${funbleCd}?size=${QUOTE_PAGE_SIZE}&page=${page}`
    );
    all.push(...(data.data || []));
    hasNext = data.hasNext === true;
    page++;
  }
  return all;
}

async function syncOne(
  turso: ReturnType<typeof createClient>,
  funbleCd: string
): Promise<{ rows: number; latest: string | null }> {
  const stockRes = await turso.execute({
    sql: "SELECT id FROM stocks WHERE funble_cd = ? LIMIT 1",
    args: [funbleCd],
  });
  const stockIdRaw = stockRes.rows[0]?.id;
  if (stockIdRaw === undefined || stockIdRaw === null) {
    throw new Error(`No stock in DB for funble_cd=${funbleCd}`);
  }
  const stockId = Number(stockIdRaw);

  console.log(`Fetching daily quotes for ${funbleCd} (stock_id=${stockId}, size=${QUOTE_PAGE_SIZE})...`);
  const items = await fetchAllDailyQuotes(funbleCd);

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

  const latest = rows.length > 0 ? rows[0].date : null;
  console.log(`OK: ${rows.length} rows for ${funbleCd}. Latest (first item): ${latest ?? "(none)"}`);
  return { rows: rows.length, latest };
}

async function main() {
  const argvCodes = process.argv.slice(2).map((s) => s.trim()).filter(Boolean);
  const funbleCds =
    argvCodes.length > 0 ? argvCodes : ["FB2409311", "FB2212211"];

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_DATABASE_TOKEN;
  if (!tursoUrl || !tursoToken) {
    console.error("TURSO_DATABASE_URL and TURSO_DATABASE_TOKEN must be set");
    process.exit(1);
  }

  const turso = createClient({ url: tursoUrl, authToken: tursoToken });

  for (const code of funbleCds) {
    try {
      await syncOne(turso, code);
    } catch (e) {
      console.error(`[${code}]`, e);
      process.exit(1);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
