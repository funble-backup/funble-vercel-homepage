import { NextResponse } from "next/server";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

function normalizeBase(raw: string): string {
  return raw.trim().replace(/\/+$/, "");
}

function publicUrl(publicBase: string, key: string): string {
  const base = normalizeBase(publicBase);
  const k = key.replace(/^\/+/, "");
  return `${base}/${encodeURI(k)}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const key = `uploads/${filename}`;

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

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    return NextResponse.json({
      url: publicUrl(publicBase, key),
      filename: file.name,
    });
  } catch {
    return NextResponse.json({ error: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}
