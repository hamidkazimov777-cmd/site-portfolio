import Link from "next/link";
import type { SiteSettings } from "@prisma/client";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function SiteFooter({
  settings,
  dict,
}: {
  settings: SiteSettings;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();

  const links = [
    settings.githubUrl && { label: "GitHub", href: settings.githubUrl },
    settings.linkedinUrl && { label: "LinkedIn", href: settings.linkedinUrl },
    settings.email && { label: "Email", href: `mailto:${settings.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col items-start justify-between gap-4 py-10 md:flex-row md:items-center">
        <p className="text-sm text-muted-foreground">
          &copy; {year} {settings.fullName}. {dict.footer.rights}
        </p>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
