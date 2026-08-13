import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      telegramId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    telegramId: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    telegramId: string;
  }
}
