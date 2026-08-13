import { PrismaClient, SkillCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      fullName: "Hamid Kazimov",
      role: "Founder & AI Product Builder",
      tagline:
        "I build real products with AI — from strategy and design to launch.",
      aboutBody:
        "Hamid Kazimov is a Founder and AI Product Builder — a Creative Technologist and Product Architect with a background as an Art Director, Senior Graphic Designer, DJ and music director. He specializes in turning ideas into shipped digital products through an AI-first workflow that combines product strategy, UX/UI design, and AI-assisted development with tools like Claude, GPT, Gemini, Kimi, Cursor, Windsurf and Codex — not programming for its own sake, but engineering real outcomes: idea → product strategy → UX → AI-assisted build → launch.",
      avatarUrl: null,
      email: "hamid.kazimov96@gmail.com",
      phonePrimary: "+7 930 226 80 36",
      phoneSecondary: "+994 55 298 29 82",
      linkedinUrl: "https://linkedin.com/in/hamid-kazimov",
      githubUrl: "https://github.com/hamidkazimov777-cmd",
      websiteUrl: "https://convertra.pages.dev",
      seoTitle: "Hamid Kazimov — Founder & AI Product Builder",
      seoDescription:
        "Founder & AI Product Builder. Creative Technologist and Product Architect building native apps, web platforms and automation systems with AI-first workflows.",
      ogImageUrl: null,
      twitterHandle: null,
      schemaJsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Hamid Kazimov",
        jobTitle: "Founder & AI Product Builder",
        email: "mailto:hamid.kazimov96@gmail.com",
        url: "https://convertra.pages.dev",
        sameAs: [
          "https://linkedin.com/in/hamid-kazimov",
          "https://github.com/hamidkazimov777-cmd",
        ],
      },
    },
  });

  const skills: { category: SkillCategory; name: string; order: number }[] = [
    { category: "PRODUCT", name: "Product Strategy", order: 0 },
    { category: "PRODUCT", name: "MVP Development", order: 1 },
    { category: "PRODUCT", name: "Feature Planning", order: 2 },
    { category: "PRODUCT", name: "Release Management", order: 3 },
    { category: "PRODUCT", name: "UX Architecture", order: 4 },

    { category: "AI", name: "Claude", order: 0 },
    { category: "AI", name: "ChatGPT", order: 1 },
    { category: "AI", name: "Gemini", order: 2 },
    { category: "AI", name: "Kimi", order: 3 },
    { category: "AI", name: "Cursor", order: 4 },
    { category: "AI", name: "Windsurf", order: 5 },
    { category: "AI", name: "AI Product Delivery", order: 6 },

    { category: "DEVELOPMENT", name: "Swift", order: 0 },
    { category: "DEVELOPMENT", name: "SwiftUI", order: 1 },
    { category: "DEVELOPMENT", name: "TypeScript", order: 2 },
    { category: "DEVELOPMENT", name: "React", order: 3 },
    { category: "DEVELOPMENT", name: "Next.js", order: 4 },
    { category: "DEVELOPMENT", name: "Python", order: 5 },
    { category: "DEVELOPMENT", name: "PostgreSQL", order: 6 },
    { category: "DEVELOPMENT", name: "Prisma", order: 7 },
    { category: "DEVELOPMENT", name: "GitHub", order: 8 },

    { category: "DESIGN", name: "Figma", order: 0 },
    { category: "DESIGN", name: "Design Systems", order: 1 },
    { category: "DESIGN", name: "Creative Direction", order: 2 },
    { category: "DESIGN", name: "Brand Identity", order: 3 },
    { category: "DESIGN", name: "Motion Design", order: 4 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({
      where: { category: skill.category, name: skill.name },
    });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }

  const experiences = [
    {
      role: "Founder & AI Product Builder",
      company: null,
      startDate: new Date("2025-01-01"),
      endDate: null,
      isCurrent: true,
      description:
        "Building AI-first digital products end to end — from product strategy and UX to AI-assisted development and launch. Shipping Convertra, Convertra AudioCore, ForzaDJ and AI product automation systems.",
      order: 0,
    },
    {
      role: "Senior Graphic Designer",
      company: null,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-01-01"),
      isCurrent: false,
      description:
        "Led visual design across brand and product surfaces, translating creative direction into production-ready assets and design systems.",
      order: 1,
    },
    {
      role: "Art Director",
      company: null,
      startDate: new Date("2021-01-01"),
      endDate: new Date("2025-01-01"),
      isCurrent: false,
      description:
        "Owned creative direction and brand identity across campaigns, product visuals and motion design, bridging creative vision with execution.",
      order: 2,
    },
  ];

  for (const exp of experiences) {
    const existing = await prisma.experience.findFirst({
      where: { role: exp.role, startDate: exp.startDate },
    });
    if (!existing) {
      await prisma.experience.create({ data: exp });
    }
  }

  const projects = [
    {
      slug: "convertra",
      title: "Convertra",
      tagline:
        "Native macOS app for DJs and music professionals — library, analysis and conversion, all local.",
      category: "macOS App",
      status: "PUBLISHED" as const,
      order: 0,
      heroHeadline: "Convertra",
      heroSubheadline:
        "A native macOS application built for DJs and music professionals to manage, analyze and convert their audio libraries entirely on-device.",
      story:
        "Convertra started from a simple frustration shared by working DJs: track libraries scattered across formats, no fast way to check key and BPM compatibility, and cloud tools that don't respect a local, offline workflow. Convertra was built to be the native macOS home for a DJ's library — fast, private and precise.",
      problem:
        "DJs and music professionals need to import, organize and prepare large audio libraries quickly, but existing tools are either web-based, slow, or lack accurate BPM and key detection needed for Camelot-wheel harmonic mixing.",
      solution:
        "Convertra ships as a native macOS app with local audio import, library management, BPM and key analysis, Camelot notation, metadata editing, a built-in audio player and MP3 conversion — all processed locally without uploading files anywhere.",
      architecture:
        "Built natively for macOS with a Swift and SwiftUI front end. Audio import and library management run on-device, backed by a local analysis pipeline (see Convertra AudioCore) that performs BPM detection, key detection and Camelot conversion without any network dependency.",
      results:
        "A fully local, production-ready DJ library tool that lets professionals analyze and prepare tracks in seconds instead of minutes, with zero cloud dependency and full control over their music files.",
      technologies: ["Swift", "SwiftUI", "macOS", "Audio Processing", "Camelot Notation"],
      links: { website: "https://convertra.pages.dev" },
      seoTitle: "Convertra — Native macOS App for DJs | Hamid Kazimov",
      seoDescription:
        "Convertra is a native macOS app for DJs and music professionals: audio import, library management, BPM and key analysis, Camelot notation and local MP3 conversion.",
    },
    {
      slug: "audiocore",
      title: "Convertra AudioCore",
      tagline: "The proprietary DSP engine behind Convertra's audio analysis.",
      category: "Audio Engine",
      status: "PUBLISHED" as const,
      order: 1,
      heroHeadline: "Convertra AudioCore",
      heroSubheadline:
        "A proprietary digital signal processing engine that powers accurate, fully local audio analysis for Convertra.",
      story:
        "Accurate BPM and key detection is the foundation every DJ workflow depends on. Rather than relying on third-party analysis services, AudioCore was built as a dedicated, local-first DSP engine tuned specifically for DJ use cases.",
      problem:
        "Off-the-shelf audio analysis libraries are either inaccurate for electronic and dance music, require cloud processing, or are too slow for large library scans.",
      solution:
        "AudioCore is a custom-built audio engine that performs BPM detection, musical key detection and Camelot wheel conversion entirely on-device, wrapped in a Swift audio engine designed for speed and accuracy at library scale.",
      architecture:
        "A native Swift audio engine implementing DSP pipelines for tempo tracking and key/chroma analysis, converting raw detection results into Camelot notation for harmonic mixing. Designed as a standalone core so it can power Convertra and future audio tools without any server round-trip.",
      results:
        "Enables Convertra to analyze full libraries locally, in real time, with professional-grade BPM and key accuracy and zero data leaving the user's machine.",
      technologies: ["Swift", "DSP", "Audio Analysis", "BPM Detection", "Key Detection", "Camelot Conversion"],
      links: {},
      seoTitle: "Convertra AudioCore — Local Audio Analysis Engine | Hamid Kazimov",
      seoDescription:
        "AudioCore is the proprietary DSP engine behind Convertra: BPM detection, key detection, Camelot conversion and fully local audio analysis built in Swift.",
    },
    {
      slug: "forzadj",
      title: "ForzaDJ",
      tagline: "A DJ pool platform with Telegram login, publishing and community tools.",
      category: "Web Platform",
      status: "PUBLISHED" as const,
      order: 2,
      heroHeadline: "ForzaDJ",
      heroSubheadline:
        "A DJ pool platform connecting music professionals through Telegram-native login, content publishing and catalog management.",
      story:
        "DJ pools traditionally rely on clunky FTP-style downloads and closed communities. ForzaDJ reimagines the DJ pool as a modern web platform built around Telegram — the messaging app DJs and labels already use daily.",
      problem:
        "Independent DJs and labels need a lightweight way to distribute and discover new music, moderate submissions, and manage a growing catalog without building custom infrastructure from scratch.",
      solution:
        "ForzaDJ provides Telegram Login for frictionless authentication, music upload and publishing, catalog management, and automated moderation — turning a DJ pool into a self-serve platform for a music community.",
      architecture:
        "A web platform integrating Telegram Login as the primary auth layer, with upload and publishing pipelines connected to automated moderation and catalog workflows, designed to scale with a growing music community.",
      results:
        "A working DJ pool platform where the community can log in through Telegram, publish and manage music, with automation reducing manual moderation overhead.",
      technologies: ["Next.js", "TypeScript", "Telegram Login", "PostgreSQL", "Automation"],
      links: {},
      seoTitle: "ForzaDJ — DJ Pool Platform | Hamid Kazimov",
      seoDescription:
        "ForzaDJ is a DJ pool platform with Telegram Login, music publishing, catalog management and automated moderation for a music community.",
    },
    {
      slug: "automation",
      title: "AI Product Automation",
      tagline: "Automated content publishing, moderation and workflow systems built on Telegram bots.",
      category: "Automation System",
      status: "PUBLISHED" as const,
      order: 3,
      heroHeadline: "AI Product Automation",
      heroSubheadline:
        "Automated systems for content publishing, moderation and workflow orchestration, built around Telegram bots and AI pipelines.",
      story:
        "Every product Hamid ships eventually needs the boring parts automated: publishing, moderation, notifications, content pipelines. This set of systems grew out of solving that problem repeatedly across Convertra, ForzaDJ and other product work.",
      problem:
        "Manual content publishing and moderation don't scale, and most off-the-shelf automation tools aren't tailored to the specific workflows of niche music and product communities.",
      solution:
        "A collection of Telegram bots and automation pipelines that handle publishing, moderation and workflow orchestration — configurable content pipelines that plug into existing product surfaces.",
      architecture:
        "Telegram Bot API integrations feeding into workflow orchestration and content pipelines, with moderation rules and publishing automation layered on top so human review is only needed for edge cases.",
      results:
        "Significant reduction in manual publishing and moderation work across products, with reliable, repeatable workflow systems that can be reused across new product lines.",
      technologies: ["Telegram Bots", "Python", "Workflow Automation", "Content Pipelines"],
      links: {},
      seoTitle: "AI Product Automation — Publishing & Moderation Systems | Hamid Kazimov",
      seoDescription:
        "Automated content publishing, moderation and workflow systems built on Telegram bots and AI pipelines by Hamid Kazimov.",
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
