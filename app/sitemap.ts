import type { MetadataRoute } from "next";
import { fetchPublishedProjects } from "@/lib/data";
import { locales } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const projects = await fetchPublishedProjects();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.9,
    });
    for (const project of projects) {
      entries.push({
        url: `${siteUrl}/${locale}/projects/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
