import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/settings";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const title = settings.seoTitle ?? `${settings.fullName} — ${settings.role}`;
  const description = settings.seoDescription ?? settings.tagline;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s — ${settings.fullName}`,
    },
    description,
    keywords: [
      "Hamid Kazimov",
      "AI Product Builder",
      "Founder",
      "Creative Technologist",
      "Product Architect",
      "AI-assisted development",
    ],
    authors: [{ name: settings.fullName }],
    creator: settings.fullName,
    openGraph: {
      type: "website",
      url: siteUrl,
      title,
      description,
      siteName: settings.fullName,
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: settings.twitterHandle ?? undefined,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const jsonLd = settings.schemaJsonLd ?? {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.fullName,
    jobTitle: settings.role,
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
