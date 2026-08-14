import { fetchSettings } from "@/lib/data";
import type { SiteSettings } from "@prisma/client";

const FALLBACK_SETTINGS: SiteSettings = {
  id: "singleton",
  fullName: "Hamid Kazimov",
  role: "Founder & AI Product Builder",
  tagline: "I build real products with AI — from strategy and design to launch.",
  aboutBody: null,
  avatarUrl: null,
  email: null,
  phonePrimary: null,
  phoneSecondary: null,
  linkedinUrl: null,
  githubUrl: null,
  websiteUrl: null,
  seoTitle: "Hamid Kazimov — Founder & AI Product Builder",
  seoDescription:
    "Founder & AI Product Builder. Creative Technologist and Product Architect building native apps, web platforms and automation systems with AI-first workflows.",
  ogImageUrl: null,
  twitterHandle: null,
  schemaJsonLd: null,
  translations: null,
  updatedAt: new Date(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await fetchSettings();
    return settings ?? FALLBACK_SETTINGS;
  } catch {
    return FALLBACK_SETTINGS;
  }
}
