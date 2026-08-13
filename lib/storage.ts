import { randomUUID } from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export class UploadError extends Error {}

function buildFileName(originalName: string) {
  const ext = path.extname(originalName) || "";
  return `${randomUUID()}${ext}`;
}

/**
 * Uploads an image and returns its public URL.
 *
 * Uses Cloudflare R2 (S3-compatible) when R2 credentials are configured —
 * the correct path for a Cloudflare Pages/Workers deployment, since the
 * runtime has no writable local filesystem. Falls back to writing into
 * /public/uploads for local development, where a Node.js filesystem is
 * available.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadError("Unsupported file type. Use PNG, JPEG, WEBP, GIF or SVG.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadError("File is too large. Maximum size is 8MB.");
  }

  const fileName = buildFileName(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  const r2AccountId = process.env.R2_ACCOUNT_ID;
  const r2Bucket = process.env.R2_BUCKET;
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const r2PublicUrl = process.env.R2_PUBLIC_URL;

  if (r2AccountId && r2Bucket && r2AccessKeyId && r2SecretAccessKey && r2PublicUrl) {
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    });

    await client.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: `uploads/${fileName}`,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    return `${r2PublicUrl.replace(/\/$/, "")}/uploads/${fileName}`;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), buffer);

  return `/uploads/${fileName}`;
}
