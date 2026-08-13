<div align="center">

# Hamid Kazimov — Founder & AI Product Builder

**Personal site & founder OS — Product Strategy · UX/UI · AI-assisted Development**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?logo=prisma)](https://www.prisma.io)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-F38020?logo=cloudflare)](https://pages.cloudflare.com)
[![License](https://img.shields.io/badge/license-Private-lightgrey)](#)

</div>

---

A production Next.js 15 site — not a landing page, a personal operating
system for a Founder & AI Product Builder. It ships with a full case-study
system for products, a Telegram-only CMS admin panel, and English / Russian /
Spanish localization.

> *"I build real products with AI — from strategy and design to launch."*

## ✨ Highlights

- **Idea → Strategy → UX → AI-assisted Build → Launch**, told through a
  7-step interactive timeline and four case studies (Convertra, Convertra
  AudioCore, ForzaDJ, AI Product Automation).
- **`/control`** — a from-scratch CMS: Projects, Skills, Experience, About,
  Contacts and SEO, all edited inline with optimistic saves, no page reloads.
- **Telegram Login only.** A single allow-listed Telegram ID can sign in —
  no passwords, no third-party auth provider, no other login path.
- **EN / RU / ES** locale-prefixed routing (`/en`, `/ru`, `/es`) with a
  language switcher in the header.
- **Cloudflare-ready.** Ships with `@opennextjs/cloudflare` + `wrangler`,
  a Neon Postgres driver adapter for Workers, and an R2 image-upload path.
- Dark, restrained design system — Apple / Linear / Raycast inspired, built
  on Tailwind v4 tokens and hand-built shadcn/ui-style primitives.

## 🧱 Stack

| Layer      | Choice                                                          |
| ---------- | ---------------------------------------------------------------- |
| Framework  | Next.js 15 (App Router, Server Components, Route Handlers)       |
| Language   | TypeScript, strict mode                                          |
| Styling    | Tailwind CSS v4, `next/font` (Inter, JetBrains Mono)              |
| Data       | Prisma ORM + PostgreSQL (Neon-compatible for edge deploys)        |
| Auth       | Auth.js (NextAuth v5) — Telegram Login Widget Credentials provider |
| Forms      | React Hook Form + Zod                                            |
| Motion     | Framer Motion                                                    |
| Deployment | Cloudflare Pages/Workers via `@opennextjs/cloudflare`             |

## 📁 Structure

```
app/
  [locale]/(site)/       # Public site — /en, /ru, /es
    page.tsx             # Hero, Products, How I Build, Capabilities, Contact
    projects/[slug]/     # Case study pages
  control/                # Telegram-auth gated admin panel
    projects/ skills/ experience/ about/ contacts/ seo/ messages/
  api/
    auth/[...nextauth]/
    contact/              # Public contact form
    admin/                # CRUD endpoints, protected by middleware
components/
  sections/               # Public site sections
  admin/                  # Admin panel building blocks
  ui/                     # Design system primitives
lib/                      # db, auth, telegram verification, storage, i18n
prisma/                   # schema.prisma, migrations, seed.ts
```

## 🚀 Quick start

```bash
npm install
cp .env.example .env          # fill in DATABASE_URL, AUTH_SECRET, Telegram vars
npx prisma dev                # or: docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Full setup, Telegram Login configuration and Cloudflare deployment steps are
in [`SETUP.md`](./SETUP.md).

## 🗂️ Content model

`Project`, `ProjectImage`, `Skill`, `Experience`, `Contact`, `SiteSettings`
and a Telegram-only `User` — see [`prisma/schema.prisma`](./prisma/schema.prisma).
Everything shown on the public site is editable from `/control`; the seed
data reflects Hamid Kazimov's real products and background.

## 📄 License

Private project — all rights reserved.
