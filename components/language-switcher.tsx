"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  es: "ES",
};

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  function pathFor(target: Locale) {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || "/";
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-0.5">
      {locales.map((l) => (
        <Link
          key={l}
          href={pathFor(l)}
          className={cn(
            "rounded px-2 py-1 text-xs font-medium transition-colors",
            l === locale
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LABELS[l]}
        </Link>
      ))}
    </div>
  );
}
