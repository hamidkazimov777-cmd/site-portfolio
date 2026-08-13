import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Cloudflare Workers have no raw TCP sockets, so when DATABASE_URL points at
 * Neon, Prisma talks to Postgres through Neon's HTTP/WebSocket driver adapter.
 * Against any other Postgres, it falls back to the default TCP connection.
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
