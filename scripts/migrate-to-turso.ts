import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const DB_PATH = path.join(process.cwd(), "funble.db");
const sqlite = new Database(DB_PATH);

const tursoUrl = process.env.TURSO_DATABASE_URL!;
const tursoToken = process.env.TURSO_DATABASE_TOKEN!;

if (!tursoUrl || !tursoToken) {
  console.error("TURSO_DATABASE_URL and TURSO_DATABASE_TOKEN must be set in .env");
  process.exit(1);
}

const turso = createClient({ url: tursoUrl, authToken: tursoToken });

const TABLES = [
  "banners",
  "notices",
  "press",
  "partners",
  "investors",
  "stocks",
  "announcements",
  "stock_prices",
  "faq_categories",
  "faqs",
  "terms",
  "admin_users",
];

// Get CREATE TABLE statements from SQLite
const CREATE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, image_url TEXT NOT NULL DEFAULT '', mobile_image_url TEXT NOT NULL DEFAULT '', link_url TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS press (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, link_url TEXT NOT NULL DEFAULT '', file_url TEXT DEFAULT '', notice_at TEXT NOT NULL DEFAULT (datetime('now')), created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, logo_url TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS investors (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, logo_url TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT, funble_cd TEXT NOT NULL UNIQUE, funble_nm TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'end', sort_order INTEGER NOT NULL DEFAULT 0, thumb_img_url TEXT DEFAULT '', scr_price REAL DEFAULT 0, total_issue_qty INTEGER DEFAULT 0, list_at TEXT DEFAULT '', extra_json TEXT DEFAULT '{}'
  )`,
  `CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT, stock_id INTEGER NOT NULL, title TEXT NOT NULL, category TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '', file_url TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')), FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS stock_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT, stock_id INTEGER NOT NULL, price REAL NOT NULL DEFAULT 0, begin_price REAL DEFAULT 0, end_price REAL DEFAULT 0, high_price REAL DEFAULT 0, low_price REAL DEFAULT 0, deal_qty INTEGER DEFAULT 0, date TEXT NOT NULL, FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS faq_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, code TEXT NOT NULL UNIQUE, sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER NOT NULL, question TEXT NOT NULL, answer TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, FOREIGN KEY (category_id) REFERENCES faq_categories(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS terms (
    id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, version_date TEXT NOT NULL, content TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(type, version_date)
  )`,
  `CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
];

async function migrate() {
  console.log("=== Turso Migration Start ===\n");

  // 1. Create tables
  console.log("[1/3] Creating tables...");
  for (const stmt of CREATE_STATEMENTS) {
    await turso.execute(stmt);
  }
  console.log("  -> Tables created.\n");

  // 2. Migrate data table by table
  console.log("[2/3] Migrating data...");
  for (const table of TABLES) {
    const rows = sqlite.prepare(`SELECT * FROM ${table}`).all() as Record<string, unknown>[];
    if (rows.length === 0) {
      console.log(`  ${table}: 0 rows (skip)`);
      continue;
    }

    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => "?").join(", ");
    const insertSql = `INSERT OR IGNORE INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;

    // Batch insert in chunks of 20
    const CHUNK_SIZE = 20;
    let inserted = 0;
    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE);
      const statements = chunk.map((row) => ({
        sql: insertSql,
        args: columns.map((col) => {
          const val = row[col];
          if (val === null || val === undefined) return null;
          return val as string | number | bigint | ArrayBuffer;
        }),
      }));
      await turso.batch(statements);
      inserted += chunk.length;
    }
    console.log(`  ${table}: ${inserted} rows migrated`);
  }

  // 3. Verify
  console.log("\n[3/3] Verifying...");
  for (const table of TABLES) {
    const local = sqlite.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get() as { cnt: number };
    const remote = await turso.execute(`SELECT COUNT(*) as cnt FROM ${table}`);
    const remoteCnt = remote.rows[0]?.cnt ?? 0;
    const match = local.cnt === Number(remoteCnt) ? "OK" : "MISMATCH!";
    console.log(`  ${table}: local=${local.cnt} remote=${remoteCnt} [${match}]`);
  }

  console.log("\n=== Migration Complete ===");
}

migrate().catch(console.error);
