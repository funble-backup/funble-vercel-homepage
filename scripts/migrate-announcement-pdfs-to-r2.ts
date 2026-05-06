/**
 * Download announcement PDFs (remote or existing public/announcements-pdfs paths),
 * upload to Cloudflare R2, update announcements.file_url JSON with public URLs.
 *
 * Prereqs: R2 bucket + public access (r2.dev or custom domain), API token with write.
 *
 * Env:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *   R2_PUBLIC_BASE_URL — e.g. https://pub-xxx.r2.dev (no trailing slash)
 *   Optional: DRY_RUN=1 — log actions without PutObject or DB updates
 *
 * Usage: npx tsx scripts/migrate-announcement-pdfs-to-r2.ts
 */

import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { queryAll, execute } from "../src/lib/db";
import {
  downloadPdf,
  isAnnouncementAssetHostedOnCdn,
  isLocalAnnouncementsPath,
  isPdf,
  sanitizeBaseName,
  type AnnouncementFileItem,
} from "../src/lib/announcement-pdf-local";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

function publicObjectUrl(publicBase: string, key: string): string {
  const base = publicBase.replace(/\/+$/, "");
  const k = key.replace(/^\/+/, "");
  return `${base}/${encodeURI(k)}`;
}

function decodePathForDisk(p: string): string {
  // DB may store URL-encoded filenames (encodeURIComponent). On disk the filenames are decoded.
  // We decode each segment to avoid turning slashes into path separators.
  return p
    .split("/")
    .map((seg) => {
      try {
        return decodeURIComponent(seg);
      } catch {
        return seg;
      }
    })
    .join("/");
}

async function readPdfBytes(
  announcementId: number,
  item: AnnouncementFileItem,
  index: number
): Promise<Buffer> {
  if (isLocalAnnouncementsPath(item.url)) {
    const rel = decodePathForDisk(item.url.replace(/^\/+/, ""));
    const filePath = path.join(process.cwd(), "public", rel);
    return fs.readFile(filePath);
  }
  return downloadPdf(item.url);
}

async function main() {
  const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
  const accountId = requireEnv("R2_ACCOUNT_ID");
  const bucket = requireEnv("R2_BUCKET_NAME");
  const publicBase = requireEnv("R2_PUBLIC_BASE_URL");

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });

  const rows = await queryAll<{ id: number; file_url: string }>(
    `SELECT id, file_url FROM announcements
     WHERE file_url IS NOT NULL AND trim(file_url) != ''`
  );

  let rowsUpdated = 0;
  let filesUploaded = 0;
  let filesSkipped = 0;

  for (const row of rows) {
    let items: AnnouncementFileItem[];
    try {
      items = JSON.parse(row.file_url) as AnnouncementFileItem[];
      if (!Array.isArray(items)) continue;
    } catch {
      continue;
    }

    const next = [...items];
    let rowTouched = false;

    for (let i = 0; i < next.length; i++) {
      const f = next[i];
      if (!isPdf(f) || !f.url?.trim()) continue;
      if (isAnnouncementAssetHostedOnCdn(f.url)) {
        filesSkipped++;
        continue;
      }

      const objectKey = `announcements/${row.id}/${i}-${sanitizeBaseName(f.name, i)}.pdf`;

      try {
        const body = await readPdfBytes(row.id, f, i);
        if (!dryRun) {
          await s3.send(
            new PutObjectCommand({
              Bucket: bucket,
              Key: objectKey,
              Body: body,
              ContentType: "application/pdf",
            })
          );
        }
        const newUrl = publicObjectUrl(publicBase, objectKey);
        next[i] = { ...f, url: newUrl, ext: "pdf" };
        rowTouched = true;
        filesUploaded++;
      } catch (e) {
        console.error(
          `[announcement ${row.id}] R2 migrate failed for item ${i} (${f.name}):`,
          e instanceof Error ? e.message : e
        );
      }
    }

    if (rowTouched && !dryRun) {
      await execute(
        "UPDATE announcements SET file_url = ? WHERE id = ?",
        JSON.stringify(next),
        row.id
      );
      rowsUpdated++;
    } else if (rowTouched && dryRun) {
      rowsUpdated++;
    }
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        announcementsScanned: rows.length,
        rowsUpdated,
        filesUploaded,
        filesSkippedAlreadyOnCdn: filesSkipped,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
