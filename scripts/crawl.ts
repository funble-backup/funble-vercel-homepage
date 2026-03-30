import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "funble.db");
const BASE_URL = "https://www.funble.kr";

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ---- DB Init ----
function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '', link_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );
    CREATE TABLE IF NOT EXISTS press (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
      link_url TEXT NOT NULL DEFAULT '', file_url TEXT DEFAULT '',
      notice_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      logo_url TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS investors (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      logo_url TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT, funble_cd TEXT NOT NULL UNIQUE,
      funble_nm TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'end',
      sort_order INTEGER NOT NULL DEFAULT 0, thumb_img_url TEXT DEFAULT '',
      scr_price REAL DEFAULT 0, total_issue_qty INTEGER DEFAULT 0,
      list_at TEXT DEFAULT '', extra_json TEXT DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT, stock_id INTEGER NOT NULL,
      title TEXT NOT NULL, category TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS stock_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT, stock_id INTEGER NOT NULL,
      price REAL NOT NULL DEFAULT 0, begin_price REAL DEFAULT 0,
      end_price REAL DEFAULT 0, high_price REAL DEFAULT 0,
      low_price REAL DEFAULT 0, deal_qty INTEGER DEFAULT 0, date TEXT NOT NULL,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS faq_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE, sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER NOT NULL,
      question TEXT NOT NULL, answer TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES faq_categories(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// ---- Helpers ----
async function fetchJson(urlPath: string): Promise<any> {
  const url = urlPath.startsWith("http") ? urlPath : `${BASE_URL}${urlPath}`;
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function fetchAllPages(urlPath: string): Promise<any[]> {
  const allData: any[] = [];
  let page = 0;
  let hasNext = true;
  while (hasNext) {
    const sep = urlPath.includes("?") ? "&" : "?";
    const data = await fetchJson(`${urlPath}${sep}page=${page}`);
    if (data.data && Array.isArray(data.data)) {
      allData.push(...data.data);
    }
    hasNext = data.hasNext === true;
    page++;
  }
  return allData;
}

// ---- Crawlers ----
async function crawlNotices() {
  console.log("\n[1/7] Crawling notices...");
  const items = await fetchAllPages("/api/co/v1/support/notices");
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO notices (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
  );
  for (const item of items) {
    stmt.run(item.id, item.title, item.detail || "", item.createdAt, item.updatedAt || null);
  }
  console.log(`  -> ${items.length} notices saved`);
}

async function crawlPress() {
  console.log("\n[2/7] Crawling press...");
  const items = await fetchAllPages("/api/co/v1/community/pressmanagement/PRESS");
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO press (id, title, link_url, file_url, notice_at, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  );
  for (const item of items) {
    stmt.run(item.id, item.title, item.linkUrl || "", item.fileUrl || "", item.noticeAt, item.noticeAt);
  }
  console.log(`  -> ${items.length} press items saved`);
}

async function crawlBanners() {
  console.log("\n[3/7] Crawling banners...");
  try {
    const data = await fetchJson("/api/co/v1/community/pressmanagement/MAIN");
    const items = data.data || [];
    if (Array.isArray(items) && items.length > 0) {
      const stmt = db.prepare(
        `INSERT OR REPLACE INTO banners (id, title, image_url, link_url, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?)`
      );
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        stmt.run(item.id, item.title || "", item.fileUrl || "", item.linkUrl || "", i, item.noticeAt || new Date().toISOString());
      }
      console.log(`  -> ${items.length} banners saved`);
    } else {
      console.log("  -> No banner data available, inserting placeholders");
      const stmt = db.prepare(
        `INSERT INTO banners (title, image_url, link_url, sort_order) VALUES (?, ?, ?, ?)`
      );
      stmt.run("펀블 앱 다운로드", "/images/banners/banner1.png", "#", 0);
      stmt.run("펀블 투자 시작하기", "/images/banners/banner2.png", "#", 1);
      stmt.run("펀블 포인트 이벤트", "/images/banners/banner3.png", "#", 2);
    }
  } catch (e) {
    console.log("  -> Banner API failed, inserting placeholders");
    const stmt = db.prepare(
      `INSERT INTO banners (title, image_url, link_url, sort_order) VALUES (?, ?, ?, ?)`
    );
    stmt.run("펀블 앱 다운로드", "/images/banners/banner1.png", "#", 0);
    stmt.run("펀블 투자 시작하기", "/images/banners/banner2.png", "#", 1);
    stmt.run("펀블 포인트 이벤트", "/images/banners/banner3.png", "#", 2);
  }
}

async function crawlStocks() {
  console.log("\n[4/7] Crawling stocks (all_info)...");
  const data = await fetchJson("/api/main/v1/subscribe/all_info");

  const stmt = db.prepare(
    `INSERT OR REPLACE INTO stocks (funble_cd, funble_nm, status, sort_order, thumb_img_url, scr_price, total_issue_qty, list_at, extra_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  let order = 0;
  const allStocks: Array<{ funbleCd: string; status: string }> = [];

  for (const status of ["ing", "expect", "end"] as const) {
    const items = data[status] || [];
    for (const item of items) {
      const stock = item.stock || {};
      const funbleCd = stock.funbleCd || item.funbleCd;
      const funbleNm = stock.funbleNm || item.funbleNm || "";
      if (!funbleCd) continue;

      stmt.run(
        funbleCd, funbleNm, status, order++,
        item.thumbImgUrl || "", item.scrPrice || 0,
        item.totalIssueQty || 0, stock.listAt || "",
        JSON.stringify(item)
      );
      allStocks.push({ funbleCd, status });
    }
  }
  console.log(`  -> ${allStocks.length} stocks saved`);
  return allStocks;
}

async function crawlStockDetails(stocks: Array<{ funbleCd: string }>) {
  console.log("\n[5/7] Crawling stock details & announcements...");
  const annStmt = db.prepare(
    `INSERT INTO announcements (stock_id, title, category, content, file_url, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  );
  const getStockId = db.prepare(`SELECT id FROM stocks WHERE funble_cd = ?`);

  for (const { funbleCd } of stocks) {
    try {
      const data = await fetchJson(`/api/main/v1/stock/detail/${funbleCd}`);
      const stockRow = getStockId.get(funbleCd) as { id: number } | undefined;
      if (!stockRow) continue;

      const disclosures = data.disclosureList || data.discloureList || [];
      let detailCount = 0;
      for (const disc of disclosures) {
        // Fetch detail for each disclosure to get content + fileList
        let detail = "";
        let fileUrl = "";
        try {
          const detailData = await fetchJson(`/api/main/v1/productdiscloure/${disc.id}`);
          detail = detailData.data?.detail || "";
          const files = detailData.fileList || [];
          if (files.length > 0) {
            fileUrl = JSON.stringify(files.map((f: any) => ({
              name: f.originName || f.name,
              url: f.url,
              ext: f.ext
            })));
          }
        } catch {
          // detail fetch failed, continue with empty content
        }

        annStmt.run(
          stockRow.id,
          disc.title || "",
          disc.disclosureCodKo || disc.disclosureCod || "",
          detail,
          fileUrl,
          disc.createdAt || new Date().toISOString()
        );
        detailCount++;
      }
      console.log(`  -> ${funbleCd}: ${detailCount} announcements (with detail)`);
    } catch (e: any) {
      console.log(`  -> ${funbleCd}: detail fetch failed (${e.message})`);
    }
  }
}

async function crawlStockPrices(stocks: Array<{ funbleCd: string }>) {
  console.log("\n[6/7] Crawling stock prices...");
  const priceStmt = db.prepare(
    `INSERT INTO stock_prices (stock_id, price, begin_price, end_price, high_price, low_price, deal_qty, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const getStockId = db.prepare(`SELECT id FROM stocks WHERE funble_cd = ?`);

  for (const { funbleCd } of stocks) {
    const stockRow = getStockId.get(funbleCd) as { id: number } | undefined;
    if (!stockRow) continue;

    try {
      let page = 0;
      let hasNext = true;
      let totalPrices = 0;
      while (hasNext) {
        const data = await fetchJson(`/api/main/v1/stock/dailyQuote/${funbleCd}?page=${page}`);
        const items = data.data || [];
        for (const item of items) {
          const dateArr = item.stockPriceId?.at || [];
          const dateStr = dateArr.length === 3
            ? `${dateArr[0]}-${String(dateArr[1]).padStart(2, "0")}-${String(dateArr[2]).padStart(2, "0")}`
            : "";
          priceStmt.run(
            stockRow.id,
            item.dealStdPrice || 0,
            item.beginPrice || 0,
            item.endPrice || 0,
            item.highPrice || 0,
            item.lowPrice || 0,
            item.dealQty || 0,
            dateStr
          );
          totalPrices++;
        }
        hasNext = data.hasNext === true;
        page++;
      }
      console.log(`  -> ${funbleCd}: ${totalPrices} price records`);
    } catch (e: any) {
      console.log(`  -> ${funbleCd}: price fetch failed (${e.message})`);
    }
  }
}

async function crawlFaq() {
  console.log("\n[7/7] Crawling FAQ...");
  try {
    const data = await fetchJson("/api/co/v1/support/faqs");

    const catEngStr = data.categoriesEng || "";
    const catKoStr = data.categoriesKo || "";
    const catEngs = catEngStr.split(",").map((s: string) => s.trim()).filter(Boolean);
    const catKos = catKoStr.split(",").map((s: string) => s.trim()).filter(Boolean);

    const catStmt = db.prepare(
      `INSERT OR REPLACE INTO faq_categories (name, code, sort_order) VALUES (?, ?, ?)`
    );
    for (let i = 0; i < catEngs.length; i++) {
      catStmt.run(catKos[i] || catEngs[i], catEngs[i], i);
    }
    console.log(`  -> ${catEngs.length} FAQ categories saved`);

    const faqItems = data.data || [];
    if (faqItems.length > 0) {
      const faqStmt = db.prepare(
        `INSERT INTO faqs (category_id, question, answer, sort_order) VALUES (?, ?, ?, ?)`
      );
      const getCatId = db.prepare(`SELECT id FROM faq_categories WHERE code = ?`);
      for (let i = 0; i < faqItems.length; i++) {
        const item = faqItems[i];
        const catRow = getCatId.get(item.category || item.categoryCode) as { id: number } | undefined;
        faqStmt.run(catRow?.id || 1, item.question || item.title, item.answer || item.detail || "", i);
      }
      console.log(`  -> ${faqItems.length} FAQ items saved`);
    } else {
      console.log("  -> FAQ API returned no data. FAQ items need manual entry via admin.");
    }
  } catch (e: any) {
    console.log(`  -> FAQ fetch failed (${e.message}). Categories and items need manual entry.`);
  }
}

async function createAdminUser() {
  console.log("\n[Admin] Creating admin user...");
  const hash = await bcrypt.hash("funble1234", 10);
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)`
  );
  stmt.run("admin", hash);
  console.log("  -> Admin user created (admin / funble1234)");
}

// ---- Main ----
async function main() {
  console.log("=== Funble Data Crawler ===");
  console.log(`DB: ${DB_PATH}\n`);

  initTables();

  // Clear existing data
  db.exec(`
    DELETE FROM stock_prices; DELETE FROM announcements; DELETE FROM stocks;
    DELETE FROM press; DELETE FROM notices; DELETE FROM banners;
  `);
  console.log("Cleared existing data.");

  await crawlNotices();
  await crawlPress();
  await crawlBanners();
  const stocks = await crawlStocks();
  await crawlStockDetails(stocks);
  await crawlStockPrices(stocks);
  await crawlFaq();
  await createAdminUser();

  console.log("\n=== Crawling Complete ===");

  // Summary
  const counts = {
    notices: (db.prepare("SELECT COUNT(*) as c FROM notices").get() as any).c,
    press: (db.prepare("SELECT COUNT(*) as c FROM press").get() as any).c,
    banners: (db.prepare("SELECT COUNT(*) as c FROM banners").get() as any).c,
    stocks: (db.prepare("SELECT COUNT(*) as c FROM stocks").get() as any).c,
    announcements: (db.prepare("SELECT COUNT(*) as c FROM announcements").get() as any).c,
    stock_prices: (db.prepare("SELECT COUNT(*) as c FROM stock_prices").get() as any).c,
    faq_categories: (db.prepare("SELECT COUNT(*) as c FROM faq_categories").get() as any).c,
    faqs: (db.prepare("SELECT COUNT(*) as c FROM faqs").get() as any).c,
    admin_users: (db.prepare("SELECT COUNT(*) as c FROM admin_users").get() as any).c,
  };
  console.log("\nDB Summary:", counts);
  db.close();
}

main().catch((err) => {
  console.error("Crawl failed:", err);
  db.close();
  process.exit(1);
});
