import type { Locale } from "@/lib/i18n/config";
import type { Project, Experience, SiteSettings } from "@prisma/client";

/**
 * Content is authored in Russian (the base DB columns) and auto-translated to
 * English and Spanish on save, stored in each record's `translations` jsonb
 * field as `{ en: {...}, es: {...} }`. These helpers pick the right text for a
 * given locale:
 *   - ru  → the base columns (source language)
 *   - en  → translations.en, falling back to base
 *   - es  → translations.es, falling back to base
 */

// The display name is a fixed transliteration, never machine-translated.
const LATIN_NAME = "Hamid Kazimov";

function overlay(translations: unknown, locale: Locale): Record<string, string> | null {
  if (locale === "ru") return null; // Russian is the source — use base columns.
  if (!translations || typeof translations !== "object") return null;
  const byLocale = (translations as Record<string, unknown>)[locale];
  if (!byLocale || typeof byLocale !== "object") return null;
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(byLocale as Record<string, unknown>)) {
    if (typeof v === "string" && v.trim()) cleaned[k] = v;
  }
  return Object.keys(cleaned).length ? cleaned : null;
}

export function localizeProject<T extends Project>(project: T, locale: Locale): T {
  const t = overlay(project.translations, locale);
  if (!t) return project;
  return { ...project, ...t };
}

export function localizeExperience(exp: Experience, locale: Locale): Experience {
  const t = overlay(exp.translations, locale);
  if (!t) return exp;
  return { ...exp, ...t };
}

export function localizeSettings(settings: SiteSettings, locale: Locale): SiteSettings {
  const t = overlay(settings.translations, locale);
  const fullName = locale === "ru" ? settings.fullName : LATIN_NAME;
  if (!t) return { ...settings, fullName };
  return {
    ...settings,
    fullName,
    role: t.role ?? settings.role,
    tagline: t.tagline ?? settings.tagline,
    aboutBody: t.aboutBody ?? settings.aboutBody,
  };
}
