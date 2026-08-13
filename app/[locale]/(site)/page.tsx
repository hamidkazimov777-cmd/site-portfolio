import type { Metadata } from "next";
import { fetchPublishedProjects, fetchSkills, fetchExperience } from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeProject, localizeExperience, localizeSettings } from "@/lib/i18n/content";
import { Hero } from "@/components/sections/hero";
import { Products } from "@/components/sections/products";
import { HowIBuild } from "@/components/sections/how-i-build";
import { Capabilities } from "@/components/sections/capabilities";
import { Contact } from "@/components/sections/contact";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const settings = await getSiteSettings();
  return {
    title: {
      absolute: settings.seoTitle ?? `${settings.fullName} — ${settings.role}`,
    },
    description: settings.seoDescription ?? settings.tagline,
    alternates: {
      languages: { en: "/en", ru: "/ru", es: "/es" },
    },
    other: { "content-language": locale },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const [rawSettings, rawProjects, skills, rawExperience] = await Promise.all([
    getSiteSettings(),
    fetchPublishedProjects(),
    fetchSkills(),
    fetchExperience(),
  ]);

  const settings = localizeSettings(rawSettings, locale);
  const projects = rawProjects.map((p) => localizeProject(p, locale));
  const experience = rawExperience.map((e) => localizeExperience(e, locale));

  return (
    <>
      <Hero settings={settings} locale={locale} dict={dict} />
      <Products projects={projects} dict={dict} locale={locale} />
      <HowIBuild dict={dict} />
      <Capabilities skills={skills} experience={experience} dict={dict} />
      <Contact settings={settings} dict={dict} />
    </>
  );
}
