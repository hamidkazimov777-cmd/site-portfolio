import type { NextAuthConfig } from "next-auth";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year — no repeated login required

/**
 * Edge-safe base config shared between middleware and the full server
 * config. Deliberately has no providers here — Credentials providers pull
 * in Prisma and Node-only crypto, which cannot run in the Edge Runtime that
 * Next.js always uses for middleware.
 */
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  pages: {
    signIn: "/control/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.telegramId = user.telegramId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.telegramId = token.telegramId;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
