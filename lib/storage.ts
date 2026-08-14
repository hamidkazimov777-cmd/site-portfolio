const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

// Images are stored inline as base64 data URLs in the database, so they work
// everywhere (local dev and Cloudflare Workers) with no filesystem, no object
// storage and no external infrastructure. Keep the cap modest to keep rows and
// pages light.
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

export class UploadError extends Error {}

/**
 * Validates an uploaded image and returns it as a `data:` URL that can be
 * stored directly in a text column and rendered by <img>/next/image.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadError("Unsupported file type. Use PNG, JPEG, WEBP, GIF or SVG.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadError("File is too large. Maximum size is 2MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  return `data:${file.type};base64,${base64}`;
}
