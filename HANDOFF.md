# Handoff — Hamid Kazimov Portfolio

Everything you need to run, edit and deploy this project. Read this first.

## What this is

A personal portfolio + content platform for Hamid Kazimov, built with
**Next.js 15 (App Router)**, deployed to **Cloudflare Workers**, backed by a
**Neon (serverless Postgres)** database. Public site is trilingual
(**EN / RU / ES**). Content is managed through a password-protected admin panel
that is available directly on the **live site**.

## Live URLs

- **Public site:** https://hamid-kazimov-portfolio.hamidkazimov777.workers.dev
  - `/en`, `/ru`, `/es` — the root `/` redirects to `/en`
  - Project pages: `/{locale}/projects/{slug}` (convertra, audiocore, forzadj, automation)
- **Repo:** https://github.com/hamidkazimov777-cmd/site-portfolio
- **Database:** Neon project `portfolio` (dashboard: https://console.neon.tech)

## The one thing to understand: Prisma vs Cloudflare

Prisma's client **cannot run on Cloudflare Workers** — at import time it touches
the filesystem (`fs.readdir`/`readFileSync`) to load its engine, which doesn't
exist in the Workers runtime. This shaped the whole architecture:

- **Public site (deployed)** reads the DB through the **Neon serverless HTTP
  driver** (`@neondatabase/serverless`), not Prisma. All those queries live in
  [`lib/data.ts`](lib/data.ts). No Prisma is imported into the deployed bundle
  on the public paths.
- **Admin panel** uses **Prisma Edge** (via [`lib/db.ts`](lib/db.ts) and `@prisma/adapter-neon`)
  and runs fully on the **live site** (Cloudflare Workers).
  It is protected by Auth.js and requires a password to access.
- **Prisma is still used** for schema, migrations and seeding — all run locally
  in Node, where it works fine.

If you ever see `fs.readdir is not implemented` in a deploy, something on a
public path is importing Prisma again. Route it through `lib/data.ts` instead.

## Architecture at a glance

```
Public site (Cloudflare Workers)  ──HTTP──►  Neon Postgres  ◄──Prisma Edge──  Admin panel (Live site)
   reads via lib/data.ts                                                   writes via Prisma Edge
```

Content you edit locally lands in Neon and shows on the live site immediately —
the public pages are `force-dynamic` and read Neon per request, so **no redeploy
is needed for content changes**. A redeploy is only needed for **code** changes.

## Repo structure

```
app/
  [locale]/(site)/          Public site (EN/RU/ES)
    page.tsx                Home: Hero, Products, How I Build, Capabilities, Contact
    projects/[slug]/        Project case-study pages
  control/                  Admin panel (local only)
    login/                  Password login
    projects/ skills/ experience/ about/ contacts/ seo/ messages/
  api/
    contact/                Public contact form → Neon (lib/data.ts)
    admin/                  CRUD endpoints (Prisma, local only)
    auth/[...nextauth]/     Auth.js handler
lib/
  data.ts                   Neon HTTP data layer (public reads + contact insert)
  db.ts                     Prisma client (admin, local only)
  auth.ts / auth.config.ts  Auth.js password provider + edge-safe config
  settings.ts               getSiteSettings() via Neon
  i18n/
    config.ts               locales: en, ru, es
    dictionaries.ts         UI copy translations (nav, section labels, buttons…)
    content.ts              CONTENT translations (project text, experience, hero) for RU/ES
prisma/
  schema.prisma             DB models
  migrations/               SQL migrations
  seed.ts                   Seeds real Hamid Kazimov data (English)
middleware.ts               Auth gate + localhost-only admin gate
wrangler.jsonc              Cloudflare Worker config
open-next.config.ts         @opennextjs/cloudflare adapter config
```

## Local setup

Requires Node 20+ and the `.env` file (not committed — see below).

```bash
npm install
npm run dev            # http://localhost:3000  (falls back to 3001 if 3000 is busy)
```

The DB is already provisioned (Neon) and seeded. To reset/re-seed:

```bash
npm run db:deploy      # apply migrations to Neon
npm run db:seed        # seed English content
```

## Admin panel (content management)

- Access the admin panel on the live site by pressing **Command + Shift + M** (or **Ctrl + Shift + M**), or by navigating to `/control/login`.
- Login is **password-based**. The password is in `.env` as `ADMIN_PASSWORD`, and must also be set as a Cloudflare Worker secret (`wrangler secret put ADMIN_PASSWORD`) for the live admin to accept it.
- The whole admin panel (dashboard, all CRUD, settings) runs on the live site via the **Neon HTTP driver** in `lib/data.ts` — no Prisma at runtime. Writes hit Neon directly and show on the public site immediately.
- Sections: Dashboard, Projects (create/edit/publish, gallery, tech, links),
  Skills, Experience, About, Contacts, SEO, Messages (contact-form inbox).
- Saves write to Neon and appear on the live site immediately.

## Translations — important

There are **two** layers of translation:

1. **UI copy** (nav, section headers, buttons, form labels) →
   [`lib/i18n/dictionaries.ts`](lib/i18n/dictionaries.ts).
2. **Content** (project descriptions, experience, hero role/tagline, and the
   Russian name "Гамид Кязымов") → [`lib/i18n/content.ts`](lib/i18n/content.ts),
   keyed by project slug / experience role. English is the source of truth in
   the DB; RU and ES are overlays applied at render time.

**Consequence:** editing a project's text in the admin panel changes the
**English** version only. The RU/ES translations are hardcoded in
`content.ts`. If you edit content in admin, update the matching RU/ES strings in
`content.ts` and redeploy, or the other languages will drift. (A future
improvement would be per-locale fields in the DB + admin UI.)

Product names (Convertra, ForzaDJ…) and technologies (Swift, React…) are
intentionally left untranslated.

## Deploying

Deploy is only needed for **code** changes (not content).

```bash
npm run cf:build       # opennextjs-cloudflare build  (if it fails with a stale
                       # "Cannot find module ./XXXX.js", run: rm -rf .open-next .next node_modules/.cache)
npx @opennextjs/cloudflare deploy
# or the npm script:
npm run cf:deploy
```

Wrangler must be authenticated (`npx wrangler login`) with the Cloudflare
account that owns the `hamid-kazimov-portfolio` Worker.

### Secrets in production

Runtime secrets are stored as Cloudflare Worker secrets (already set):
`DATABASE_URL`, `DIRECT_URL`, `TELEGRAM_BOT_TOKEN`, `ALLOWED_TELEGRAM_ID`,
`AUTH_SECRET`. To update one:

```bash
echo -n "value" | npx wrangler secret put NAME
```

`NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` are build-time
public vars (in `.env`, baked into the build).

## Environment variables (`.env`, git-ignored)

See [`.env.example`](.env.example) for the full list. Key ones:

- `DATABASE_URL` / `DIRECT_URL` — Neon connection string
- `ADMIN_PASSWORD` — admin panel password
- `AUTH_SECRET` — Auth.js session secret (`openssl rand -base64 32`)
- `NEXT_PUBLIC_SITE_URL` — canonical site URL (used in metadata/sitemap)
- R2 vars (`R2_*`) — optional; for image uploads in production. Without them,
  local admin uploads write to `/public/uploads`.

## Known limitations / possible next steps

- **URL** is `…hamidkazimov777.workers.dev`. The `hamidkazimov777` part is the
  Cloudflare account's workers.dev subdomain. To get a clean URL: change the
  account subdomain in the Cloudflare dashboard, move to Cloudflare Pages
  (`*.pages.dev`), or attach a custom domain.
- **RU/ES content lives in `content.ts`**, not the DB (see Translations above).
- **Image uploads** need R2 configured to work on the deployed site.

## History note

Auth started as Telegram Login (bot `@hamidportfoliositeadmin_bot`, allowed
Telegram ID stored in `ALLOWED_TELEGRAM_ID`) but was switched to a simple
password because the Telegram widget requires a public domain and complicated
local testing. The Telegram code paths and env vars remain but are unused by the
current password flow.
