import crypto from "crypto";

export interface TelegramAuthPayload {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
}

const AUTH_MAX_AGE_SECONDS = 24 * 60 * 60;

/**
 * Verifies the Telegram Login Widget payload per
 * https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyTelegramAuth(payload: TelegramAuthPayload): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const { hash, ...data } = payload;
  if (!hash || !data.auth_date || !data.id) return false;

  const checkString = (Object.keys(data) as (keyof typeof data)[])
    .filter((key) => data[key] !== undefined && data[key] !== "")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  if (computedHash.length !== hash.length) return false;
  const isValidHash = crypto.timingSafeEqual(
    Buffer.from(computedHash, "hex"),
    Buffer.from(hash, "hex"),
  );
  if (!isValidHash) return false;

  const authDate = Number(payload.auth_date);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(authDate) || now - authDate > AUTH_MAX_AGE_SECONDS) {
    return false;
  }

  return true;
}

export function isAllowedTelegramId(id: string): boolean {
  const allowedId = process.env.ALLOWED_TELEGRAM_ID;
  return Boolean(allowedId) && id === allowedId;
}
