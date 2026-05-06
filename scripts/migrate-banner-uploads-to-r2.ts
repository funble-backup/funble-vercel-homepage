/**
 * Migrate banner image URLs from local /uploads/* to Cloudflare R2.
 *
 * - Reads banners.image_url and banners.mobile_image_url.
 * - For values like "/uploads/xxx.png", reads the file from public/uploads/xxx.png.
 * - Uploads to R2 under "uploads/" (same filename), and updates DB to R2 public URL.
 *
 * Env:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *   R2_PUBLIC_BASE_URL — e.g. https://pub-xxx.r2.dev (no trailing slash)
 *   Optional: DRY_RUN=1
 *
 * Usage: npx tsx scripts/migrate-banner-uploads-to-r2.ts
 */

import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { queryAll, execute } from "../src/lib/db";

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

function guessContentTypeByExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

function isLocalUploadUrl(url: string): boolean {
  return typeof url === "string" && url.startsWith("/uploads/");
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

  const rows = await queryAll<{
    id: number;
    image_url: string;
    mobile_image_url: string;
  }>("SELECT id, image_url, mobile_image_url FROM banners");

  let bannersScanned = rows.length;
  let bannersUpdated = 0;
  let filesUploaded = 0;
  let filesMissing = 0;

  for (const row of rows) {
    let nextImageUrl = row.image_url || "";
    let nextMobileUrl = row.mobile_image_url || "";
    let touched = false;

    for (const field of ["image_url", "mobile_image_url"] as const) {
      const current = field === "image_url" ? nextImageUrl : nextMobileUrl;
      if (!isLocalUploadUrl(current)) continue;

      const filename = current.replace("/uploads/", "");
      const diskPath = path.join(process.cwd(), "public", "uploads", filename);
      let buf: Buffer;
      try {
        buf = await fs.readFile(diskPath);
      } catch {
        filesMissing++;
        continue;
      }

      const objectKey = `uploads/${filename}`;
      if (!dryRun) {
        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            Body: buf,
            ContentType: guessContentTypeByExt(filename),
            CacheControl: "public, max-age=31536000, immutable",
          })
        );
      }

      const newUrl = publicObjectUrl(publicBase, objectKey);
      if (field === "image_url") nextImageUrl = newUrl;
      else nextMobileUrl = newUrl;
      touched = true;
      filesUploaded++;
    }

    if (touched) {
      bannersUpdated++;
      if (!dryRun) {
        await execute(
          "UPDATE banners SET image_url = ?, mobile_image_url = ? WHERE id = ?",
          nextImageUrl,
          nextMobileUrl,
          row.id
        );
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        bannersScanned,
        bannersUpdated,
        filesUploaded,
        filesMissing,
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

