"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface TelegramAuthUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramAuthUser) => void;
  }
}

export function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

    window.onTelegramAuth = async (user: TelegramAuthUser) => {
      setPending(true);
      setError(null);
      try {
        const result = await signIn("telegram", {
          id: String(user.id),
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          username: user.username ?? "",
          photo_url: user.photo_url ?? "",
          auth_date: String(user.auth_date),
          hash: user.hash,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/control");
          router.refresh();
        } else {
          setError(
            "This Telegram account is not authorized to access the admin panel.",
          );
        }
      } finally {
        setPending(false);
      }
    };

    if (containerRef.current && botUsername) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.setAttribute("data-telegram-login", botUsername);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-radius", "10");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.setAttribute("data-request-access", "write");
      containerRef.current.appendChild(script);
    }

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [router]);

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  if (!botUsername) {
    return (
      <p className="text-sm text-muted-foreground">
        Set <code className="text-accent">NEXT_PUBLIC_TELEGRAM_BOT_USERNAME</code>{" "}
        in your environment to enable the Telegram login widget.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={containerRef} />
      {pending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Signing in…
        </div>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
