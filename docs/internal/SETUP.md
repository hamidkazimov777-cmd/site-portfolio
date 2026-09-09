# Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Database

You need a local PostgreSQL instance. Two options:

**Option A — Docker (recommended):**

```bash
docker compose up -d
```

**Option B — Prisma's local dev Postgres (no Docker required):**

```bash
npx prisma dev
```

Copy the connection string it prints into `DATABASE_URL` in `.env`.

## 3. Environment variables

```bash
cp .env.example .env
```

Fill in `DATABASE_URL` (see above), generate `AUTH_SECRET` with
`openssl rand -base64 32`, and configure Telegram Login (see below). R2
variables can stay empty locally — uploads fall back to `/public/uploads`.

## 4. Migrate and seed

```bash
npm run db:migrate
npm run db:seed
```

This creates the schema and seeds it with Hamid Kazimov's real project,
skill, experience and contact data.

## 5. Run

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (redirects to `/en`;
`/ru` and `/es` are also available).

## Telegram Login setup (admin access)

1. Create a bot with [@BotFather](https://t.me/BotFather) (`/newbot`).
2. Run `/setdomain` on @BotFather and set it to your site's domain
   (`localhost` domains aren't accepted by Telegram — for local testing you
   need a real domain or a tunnel like ngrok pointed at `localhost:3000`).
3. Set env vars:
   - `TELEGRAM_BOT_TOKEN` — the bot token from BotFather.
   - `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` — the bot's `@username` (no `@`).
   - `ALLOWED_TELEGRAM_ID` — your numeric Telegram user ID (e.g. from
     [@userinfobot](https://t.me/userinfobot)). Only this ID can sign in.
4. Visit `/control/login` and sign in with the Telegram widget. The session
   is a secure, httpOnly cookie valid for a year — no repeated logins.

## Image uploads

The admin panel's image upload (`/api/admin/upload`) writes to
`/public/uploads` locally. In production (Cloudflare has no writable
filesystem) it automatically switches to Cloudflare R2 when these are set:

```
R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL
```

## Deploying to Cloudflare

This project ships with [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
and `wrangler.jsonc`, the same class of setup used for Convertra and ForzaDJ.

1. Provision a Cloudflare-compatible Postgres database — [Neon](https://neon.tech)
   is recommended and already wired up: when `DATABASE_URL` contains
   `neon.tech`, `lib/db.ts` automatically switches Prisma to Neon's
   HTTP/WebSocket driver adapter (`@prisma/adapter-neon`), since Cloudflare
   Workers have no raw TCP sockets for a normal Postgres connection.
2. Run migrations against that database: `DATABASE_URL=... npm run db:deploy`.
3. Set all `.env.example` variables as Cloudflare secrets
   (`wrangler secret put NAME`), including the R2 upload variables.
4. Build and deploy:

   ```bash
   npm run cf:build     # opennextjs-cloudflare build
   npm run cf:deploy    # build + wrangler deploy
   ```

   Use `npm run cf:preview` to test the Workers build locally first.

## Localization

Static UI copy (navigation, section headers, buttons, form labels) is
translated for `en`, `ru` and `es` in `lib/i18n/dictionaries.ts`. CMS content
(project descriptions, About text, taglines) is stored once per record in
whatever language it was entered in `/control` — translating content itself
would require per-locale fields on each model, which is intentionally out of
scope here.

## Scripts

```bash
npm run dev          # Development server
npm run build         # Production build (Node.js target)
npm run lint          # ESLint
npm run db:studio     # Prisma Studio
npm run db:migrate    # Create & apply a migration (dev)
npm run db:deploy     # Apply migrations (production)
npm run db:seed       # Re-run the seed script
```
