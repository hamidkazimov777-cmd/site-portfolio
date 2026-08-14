"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SiteSettings } from "@prisma/client";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const CODE_LINES = [
  { indent: 0, text: "const hamid = {" },
  { indent: 1, text: 'role: "Founder & AI Product Builder",' },
  { indent: 1, text: "builds: [" },
  { indent: 2, text: '"native macOS apps",' },
  { indent: 2, text: '"web platforms",' },
  { indent: 2, text: '"automation systems",' },
  { indent: 1, text: "]," },
  { indent: 1, text: "workflow:" },
  { indent: 2, text: '"idea → strategy → UX → AI build → launch",' },
  { indent: 0, text: "}" },
];

function highlight(text: string) {
  const parts = text.split(
    /("(?:[^"\\]|\\.)*"|const|hamid|role|builds|workflow)/g,
  );
  return parts.map((part, i) => {
    if (part.startsWith('"')) {
      return (
        <span key={i} className="text-accent">
          {part}
        </span>
      );
    }
    if (part === "const") {
      return (
        <span key={i} className="text-[#c586c0]">
          {part}
        </span>
      );
    }
    if (part === "hamid") {
      return (
        <span key={i} className="text-[#4fc1ff]">
          {part}
        </span>
      );
    }
    if (["role", "builds", "workflow"].includes(part)) {
      return (
        <span key={i} className="text-[#9cdcfe]">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function Hero({
  settings,
  locale,
  dict,
}: {
  settings: SiteSettings;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(163,177,138,0.12),transparent)]" />
      <div className="container-page grid gap-12 py-24 md:grid-cols-2 md:items-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {settings.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.avatarUrl}
              alt={settings.fullName}
              className="mb-6 size-20 rounded-full border border-border object-cover"
            />
          )}
          <p className="font-mono text-sm text-accent">{settings.role}</p>
          <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {settings.fullName}
          </h1>
          <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-muted-foreground">
            {settings.tagline}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}#products`}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              {dict.hero.viewProjects}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {dict.hero.contact}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="overflow-hidden rounded-xl border border-border bg-[#0d0e10] shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              hamid.ts
            </span>
          </div>
          <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-7 text-[#d4d4d4]">
            <code>
              {CODE_LINES.map((line, i) => (
                <div key={i} style={{ paddingLeft: `${line.indent * 1.25}rem` }}>
                  {highlight(line.text)}
                </div>
              ))}
              <span className="inline-block h-4 w-2 animate-blink bg-accent align-middle" />
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
