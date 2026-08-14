import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { fetchPublishedProjectBySlug } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeProject } from "@/lib/i18n/content";

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  return fetchPublishedProjectBySlug(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const raw = await getProject(slug);
  if (!raw) return {};
  const project = localizeProject(raw, locale);

  const title = project.seoTitle ?? `${project.title} — Hamid Kazimov`;
  const description = project.seoDescription ?? project.tagline;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      images: project.ogImageUrl ? [{ url: project.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const raw = await getProject(slug);
  if (!raw) notFound();
  const project = localizeProject(raw, locale);

  const SECTIONS: {
    key: "story" | "problem" | "solution" | "architecture" | "results";
    label: string;
  }[] = [
    { key: "story", label: dict.project.story },
    { key: "problem", label: dict.project.problem },
    { key: "solution", label: dict.project.solution },
    { key: "architecture", label: dict.project.architecture },
    { key: "results", label: dict.project.results },
  ];

  const links = (project.links as Record<string, string> | null) ?? {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.tagline,
    creator: { "@type": "Person", name: "Hamid Kazimov" },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-border py-20">
        <div className="container-page">
          <Link
            href={`/${locale}#products`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" />
            {dict.project.backToProducts}
          </Link>

          <p className="mt-8 font-mono text-sm text-accent">{project.category}</p>
          <h1 className="mt-3 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {project.heroHeadline ?? project.title}
          </h1>
          {project.heroSubheadline && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {project.heroSubheadline}
            </p>
          )}

          {Object.keys(links).length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              {Object.entries(links).map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          )}

          {project.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="mt-10 w-full rounded-xl border border-border object-cover"
            />
          )}
        </div>
      </section>

      {project.images.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="container-page">
            <p className="font-mono text-sm text-accent">{dict.project.gallery}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {project.images.map((image) => (
                <figure
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={800}
                    height={600}
                    className="h-auto w-full object-cover"
                  />
                  {image.caption && (
                    <figcaption className="p-4 text-sm text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {SECTIONS.filter((s) => project[s.key]).map((section) => (
        <section key={section.key} className="border-b border-border py-16">
          <div className="container-page grid gap-8 md:grid-cols-[200px_1fr]">
            <p className="font-mono text-sm text-accent">{section.label}</p>
            <p className="max-w-2xl text-balance leading-relaxed text-muted-foreground">
              {project[section.key] as string}
            </p>
          </div>
        </section>
      ))}

      {project.technologies.length > 0 && (
        <section className="py-16">
          <div className="container-page grid gap-8 md:grid-cols-[200px_1fr]">
            <p className="font-mono text-sm text-accent">{dict.project.technologies}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
