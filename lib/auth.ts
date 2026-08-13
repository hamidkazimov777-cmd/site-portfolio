import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { isAllowedTelegramId, verifyTelegramAuth } from "@/lib/telegram";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "telegram",
      name: "Telegram",
      credentials: {
        id: { label: "id", type: "text" },
        first_name: { label: "first_name", type: "text" },
        last_name: { label: "last_name", type: "text" },
        username: { label: "username", type: "text" },
        photo_url: { label: "photo_url", type: "text" },
        auth_date: { label: "auth_date", type: "text" },
        hash: { label: "hash", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.id || !credentials?.hash || !credentials?.auth_date) {
          return null;
        }

        const payload = {
          id: String(credentials.id),
          first_name: credentials.first_name
            ? String(credentials.first_name)
            : undefined,
          last_name: credentials.last_name
            ? String(credentials.last_name)
            : undefined,
          username: credentials.username ? String(credentials.username) : undefined,
          photo_url: credentials.photo_url
            ? String(credentials.photo_url)
            : undefined,
          auth_date: String(credentials.auth_date),
          hash: String(credentials.hash),
        };

        if (!isAllowedTelegramId(payload.id)) return null;
        if (!verifyTelegramAuth(payload)) return null;

        const user = await prisma.user.upsert({
          where: { telegramId: payload.id },
          update: {
            username: payload.username,
            firstName: payload.first_name,
            lastName: payload.last_name,
            photoUrl: payload.photo_url,
          },
          create: {
            telegramId: payload.id,
            username: payload.username,
            firstName: payload.first_name,
            lastName: payload.last_name,
            photoUrl: payload.photo_url,
          },
        });

        return {
          id: user.id,
          telegramId: user.telegramId,
          name:
            [user.firstName, user.lastName].filter(Boolean).join(" ") ||
            user.username ||
            "Hamid Kazimov",
          image: user.photoUrl ?? undefined,
        };
      },
    }),
  ],
});
