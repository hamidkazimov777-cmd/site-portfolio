import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Cloudflare Workers/Pages has no TCP sockets, so a standard node-postgres
 * connection cannot be used there. When DATABASE_URL points at Neon (the
 * Cloudflare-compatible Postgres this project is designed to deploy against),
 * Prisma is wired to Neon's HTTP/WebSocket driver adapter instead. Locally,
 * against a regular Postgres instance, Prisma falls back to its default
 * TCP connection.
 */
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? "";
  const isNeon = connectionString.includes("neon.tech");

  if (isNeon) {
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
