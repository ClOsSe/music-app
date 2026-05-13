# Music App
---

https://music-app-web.webinaexpert.workers.dev

API:

https://api.webinaexpert.workers.dev

---
Educational Spotify Clone built with a Cloudflare-first architecture.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind v4
- shadcn/ui
- Hono
- Cloudflare Workers
- Cloudflare D1
- pnpm workspace monorepo
- JWT Auth
- Zod
- OpenNext Cloudflare
- GitHub Actions

---

## Apps

### apps/web

Frontend + Admin CMS

Features:

- Public music player
- Dynamic genre filters
- Admin panel
- Track CRUD
- Genre CRUD
- Audio streaming player

### apps/api

Hono API on Cloudflare Workers

Features:

- JWT auth
- Admin middleware
- Request logging
- Request ID
- Global error handler
- Audio stream proxy
- Cover image proxy
- D1 database

### packages/shared

Shared TypeScript types.

---

## Local Development

Install:

```bash
pnpm install

Run API:

pnpm --filter api dev

Run Web:

pnpm --filter web dev

Lint:

pnpm --filter web lint
Production

Web:

https://music-app-web.webinaexpert.workers.dev

API:

https://api.webinaexpert.workers.dev
Deployment

API deploy:

cd apps/api
pnpm exec wrangler deploy

Web deploy:

cd apps/web
pnpm run deploy

GitHub Actions included for automatic deploys.

Current Status

Done:

Auth
Tracks CRUD
Genres CRUD
Public player
Audio streaming
Cover proxy
Admin CMS
Cloudflare deploy
GitHub Actions deploy
Planned:

R2 uploads
Custom domain
Better CORS
Upload UI
Notes
Public users do not need login.
Admin is only for content management.
Tracks are public.
R2 upload is postponed until billing/payment is enabled.
