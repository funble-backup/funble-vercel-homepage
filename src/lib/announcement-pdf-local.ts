import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

export type AnnouncementFileItem = { name: string; url: string; ext: string };

export function isPdf(f: AnnouncementFileItem): boolean {
  const ext = String(f.ext || "").toLowerCase();
  if (ext === "pdf") return true;
  try {
    const u = new URL(f.url, "https://example.com");
    return /\.pdf(\?|#|$)/i.test(u.pathname);
  } catch {
    return /\.pdf(\?|#|$)/i.test(f.url);
  }
}

export function isLocalAnnouncementsPath(url: string): boolean {
  return url.startsWith("/announcements-pdfs/");
}

export function sanitizeBaseName(name: string, index: number): string {
  const base = path.basename(name || `file-${index}`, path.extname(name || ""));
  const cleaned = base.replace(/[^a-zA-Z0-9가-힣._-]+/g, "_").slice(0, 80);
  return cleaned || `file-${index}`;
}

export function resolveFetchUrl(raw: string): string {
  const t = raw.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("//")) return `https:${t}`;
  if (t.startsWith("/")) return `https://www.funble.kr${t}`;
  return t;
}

export async function downloadPdf(url: string): Promise<Buffer> {
  const res = await fetch(resolveFetchUrl(url), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; FunbleHomepagePdfMirror/1.0; +https://www.funble.kr)",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (
    !ct.includes("pdf") &&
    !ct.includes("octet-stream") &&
    !ct.includes("application/download")
  ) {
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.slice(0, 5).toString() !== "%PDF-") {
      throw new Error(`Unexpected content-type: ${ct || "(empty)"}`);
    }
    return buf;
  }
  return Buffer.from(await res.arrayBuffer());
}

function normalizeAssetBase(raw: string): string {
  return raw.trim().replace(/\/+$/, "");
}

function assetBasePrefixesFromEnv(): string[] {
  const bases = [
    process.env.ANNOUNCEMENTS_ASSET_BASE_URL,
    process.env.R2_PUBLIC_BASE_URL,
  ]
    .filter(Boolean)
    .map((s) => normalizeAssetBase(s!));
  return [...new Set(bases)];
}

function assetHostsFromEnv(): Set<string> {
  const raw = process.env.ANNOUNCEMENTS_ASSET_HOSTS || "";
  const set = new Set<string>();
  for (const h of raw.split(",")) {
    const t = h.trim().toLowerCase();
    if (t) set.add(t);
  }
  return set;
}

/**
 * PDFs already served from R2 / CDN should not be re-downloaded into public/ on admin save.
 * Configure via ANNOUNCEMENTS_ASSET_BASE_URL or R2_PUBLIC_BASE_URL (prefix match),
 * ANNOUNCEMENTS_ASSET_HOSTS (comma-separated hostnames), or rely on *.r2.dev host detection.
 */
export function isAnnouncementAssetHostedOnCdn(url: string): boolean {
  if (!url?.trim()) return false;
  let parsed: URL;
  try {
    parsed = new URL(resolveFetchUrl(url));
  } catch {
    return false;
  }
  const host = parsed.hostname.toLowerCase();
  if (host.endsWith(".r2.dev")) return true;
  if (assetHostsFromEnv().has(host)) return true;
  const full = `${parsed.origin}${parsed.pathname}`;
  for (const base of assetBasePrefixesFromEnv()) {
    if (full === base || full.startsWith(`${base}/`)) return true;
  }
  return false;
}

function shouldMirrorFromRemote(url: string): boolean {
  if (!url?.trim()) return false;
  if (isLocalAnnouncementsPath(url)) return false;
  if (isAnnouncementAssetHostedOnCdn(url)) return false;
  return true;
}

/** If mirrored files already exist on disk, rewrite JSON `file_url` items to local paths (no I/O download). */
export function applyLocalPathsIfFilesExist(
  announcementId: number,
  items: AnnouncementFileItem[]
): AnnouncementFileItem[] {
  const dir = path.join(
    process.cwd(),
    "public",
    "announcements-pdfs",
    String(announcementId)
  );
  return items.map((f, i) => {
    if (!isPdf(f) || !shouldMirrorFromRemote(f.url)) return f;
    const destName = `${sanitizeBaseName(f.name, i)}.pdf`;
    const destPath = path.join(dir, destName);
    if (!fsSync.existsSync(destPath)) return f;
    const publicUrl = `/announcements-pdfs/${announcementId}/${encodeURIComponent(destName)}`;
    if (f.url === publicUrl) return f;
    return { ...f, url: publicUrl, ext: "pdf" };
  });
}

export function localizeAnnouncementFileUrlJson(
  announcementId: number,
  fileUrlJson: string
): string {
  if (!fileUrlJson?.trim()) return fileUrlJson;
  let items: AnnouncementFileItem[];
  try {
    items = JSON.parse(fileUrlJson) as AnnouncementFileItem[];
    if (!Array.isArray(items)) return fileUrlJson;
  } catch {
    return fileUrlJson;
  }
  return JSON.stringify(applyLocalPathsIfFilesExist(announcementId, items));
}

/** Download remote PDFs into public/announcements-pdfs/{id}/ and return items with local URLs. */
export async function downloadMissingPdfsAndLocalize(
  announcementId: number,
  items: AnnouncementFileItem[]
): Promise<AnnouncementFileItem[]> {
  const dir = path.join(
    process.cwd(),
    "public",
    "announcements-pdfs",
    String(announcementId)
  );
  await fs.mkdir(dir, { recursive: true });
  const next = [...items];

  for (let i = 0; i < next.length; i++) {
    const f = next[i];
    if (!isPdf(f) || !f.url || !shouldMirrorFromRemote(f.url)) continue;

    const destName = `${sanitizeBaseName(f.name, i)}.pdf`;
    const destPath = path.join(dir, destName);
    const publicUrl = `/announcements-pdfs/${announcementId}/${encodeURIComponent(destName)}`;

    let needWrite = false;
    try {
      await fs.access(destPath);
    } catch {
      needWrite = true;
    }

    if (needWrite) {
      try {
        const buf = await downloadPdf(f.url);
        await fs.writeFile(destPath, buf);
      } catch (e) {
        console.error(
          `[announcement ${announcementId}] pdf download failed:`,
          f.name,
          e instanceof Error ? e.message : e
        );
        continue;
      }
    }

    next[i] = { ...f, url: publicUrl, ext: "pdf" };
  }

  return next;
}
