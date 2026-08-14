import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth.config";

/**
 * Constant-time-ish string comparison in pure JS. Avoids node:crypto's
 * timingSafeEqual, which is not implemented in the Cloudflare Workers runtime.
 */
function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "password",
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const password = credentials?.password ? String(credentials.password) : "";
        if (!passwordMatches(password)) return null;

        return {
          id: "admin",
          telegramId: "admin",
          name: "Hamid Kazimov",
        };
      },
    }),
  ],
});
