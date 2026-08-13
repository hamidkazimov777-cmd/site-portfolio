import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function Products({
  projects,
  dict,
  locale,
}: {
  projects: Project[];
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section id="products" className="border-b border-border py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-accent">{dict.products.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {dict.products.title}
          </h2>
          <p className="mt-4 text-muted-foreground">{dict.products.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/${locale}/projects/${project.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {project.category}
                  </span>
                  <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <h3 className="mt-4 text-2xl font-medium text-foreground">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {project.tagline}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
