import { TelegramLoginButton } from "@/components/telegram-login-button";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function ControlLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          /control
        </p>
        <h1 className="mt-3 text-2xl font-medium text-foreground">
          Sign in with Telegram
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access is restricted to a single authorized Telegram account.
        </p>
        <div className="mt-8 flex justify-center">
          <TelegramLoginButton />
        </div>
      </div>
    </div>
  );
}
