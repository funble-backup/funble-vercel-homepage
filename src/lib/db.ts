import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import path from "path";

// ---------------------------------------------------------------------------
// Async DB abstraction — works with both SQLite (local) and Turso (production)
// ---------------------------------------------------------------------------
// Usage:
//   const row  = await queryOne<Notice>("SELECT * FROM notices WHERE id = ?", id);
//   const rows = await queryAll<Notice>("SELECT * FROM notices LIMIT ? OFFSET ?", limit, offset);
//   const res  = await execute("INSERT INTO notices (title) VALUES (?)", title);
//   // res.lastInsertRowid, res.changes
// ---------------------------------------------------------------------------
// Environment variables:
//   TURSO_DATABASE_URL  — libsql://your-db.turso.io
//   TURSO_AUTH_TOKEN    — Turso auth token
//   (both unset → local SQLite)
// ---------------------------------------------------------------------------

export interface ExecResult {
  lastInsertRowid: number | bigint;
  changes: number;
}

type QueryFn = <T = Record<string, unknown>>(sql: string, ...params: unknown[]) => Promise<T[]>;
type QueryOneFn = <T = Record<string, unknown>>(sql: string, ...params: unknown[]) => Promise<T | undefined>;
type ExecFn = (sql: string, ...params: unknown[]) => Promise<ExecResult>;

let _queryAll: QueryFn;
let _queryOne: QueryOneFn;
let _execute: ExecFn;
let _initialized = false;

// ---------------------------------------------------------------------------
// SQLite (local) — when TURSO_DATABASE_URL is NOT set
// ---------------------------------------------------------------------------
function initSqlite() {
  const DB_PATH = path.join(process.cwd(), "funble.db");
  const raw = new Database(DB_PATH);
  raw.pragma("journal_mode = WAL");
  raw.pragma("foreign_keys = ON");
  initTables(raw);

  _queryAll = async <T>(sql: string, ...params: unknown[]) => {
    return raw.prepare(sql).all(...params) as T[];
  };

  _queryOne = async <T>(sql: string, ...params: unknown[]) => {
    return raw.prepare(sql).get(...params) as T | undefined;
  };

  _execute = async (sql: string, ...params: unknown[]) => {
    const result = raw.prepare(sql).run(...params);
    return { lastInsertRowid: result.lastInsertRowid, changes: result.changes };
  };
}

// ---------------------------------------------------------------------------
// Turso (production) — when TURSO_DATABASE_URL IS set
// ---------------------------------------------------------------------------
function initTurso(url: string, authToken?: string) {
  const client = createClient({ url, authToken });

  _queryAll = async <T>(sql: string, ...params: unknown[]) => {
    const result = await client.execute({ sql, args: params as (string | number | null | bigint | ArrayBuffer)[] });
    return result.rows as T[];
  };

  _queryOne = async <T>(sql: string, ...params: unknown[]) => {
    const result = await client.execute({ sql, args: params as (string | number | null | bigint | ArrayBuffer)[] });
    return (result.rows[0] as T) ?? undefined;
  };

  _execute = async (sql: string, ...params: unknown[]) => {
    const result = await client.execute({ sql, args: params as (string | number | null | bigint | ArrayBuffer)[] });
    return { lastInsertRowid: result.lastInsertRowid ?? 0, changes: result.rowsAffected };
  };
}

// ---------------------------------------------------------------------------
// Init & export
// ---------------------------------------------------------------------------
function ensureInit() {
  if (_initialized) return;
  _initialized = true;

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_DATABASE_TOKEN;

  if (tursoUrl) {
    initTurso(tursoUrl, tursoToken);
  } else {
    initSqlite();
  }
}

export async function queryAll<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T[]> {
  ensureInit();
  return _queryAll<T>(sql, ...params);
}

export async function queryOne<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T | undefined> {
  ensureInit();
  return _queryOne<T>(sql, ...params);
}

export async function execute(sql: string, ...params: unknown[]): Promise<ExecResult> {
  ensureInit();
  return _execute(sql, ...params);
}

// ---------------------------------------------------------------------------
// Legacy: getDb() for SQLite-only code paths (e.g. crawl scripts)
// ---------------------------------------------------------------------------
export function getDb(): Database.Database {
  const DB_PATH = path.join(process.cwd(), "funble.db");
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initTables(db);
  return db;
}

// ---------------------------------------------------------------------------
// Table init (SQLite only — Turso uses the same schema via dashboard/migration)
// ---------------------------------------------------------------------------
function initTables(raw: Database.Database) {
  raw.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      mobile_image_url TEXT NOT NULL DEFAULT '',
      link_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS press (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      link_url TEXT NOT NULL DEFAULT '',
      file_url TEXT DEFAULT '',
      notice_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS investors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      funble_cd TEXT NOT NULL UNIQUE,
      funble_nm TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'end',
      sort_order INTEGER NOT NULL DEFAULT 0,
      thumb_img_url TEXT DEFAULT '',
      scr_price REAL DEFAULT 0,
      total_issue_qty INTEGER DEFAULT 0,
      list_at TEXT DEFAULT '',
      extra_json TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      file_url TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stock_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER NOT NULL,
      price REAL NOT NULL DEFAULT 0,
      begin_price REAL DEFAULT 0,
      end_price REAL DEFAULT 0,
      high_price REAL DEFAULT 0,
      low_price REAL DEFAULT 0,
      deal_qty INTEGER DEFAULT 0,
      date TEXT NOT NULL,
      FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS faq_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES faq_categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS terms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      version_date TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(type, version_date)
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
