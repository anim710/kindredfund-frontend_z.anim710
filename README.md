# KindredFund Frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS client for the KindredFund API.

## Setup

```bash
cp .env.example .env.local
# Point NEXT_PUBLIC_API_URL at the running backend (default http://localhost:5000/api)
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000). Set backend `CLIENT_URL=http://localhost:3000` for CORS.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

## Structure

```
app/                 # Routes only (marketing, auth, campaigns, dashboard, BFF)
modules/             # Feature UI + hooks (auth, campaigns, payments, …)
shared/
  ui/                # Button, Input, Badge, Progress, …
  components/        # Navbar, Footer
  lib/api/           # Server + browser API clients
  lib/auth/          # Cookie session helpers
  types/             # Domain types aligned with backend
middleware.ts        # Protects /dashboard/*
```

## Auth

Login/register/Google go through Next route handlers under `app/api/auth/*`, which proxy to Express and store JWTs in httpOnly cookies (`kf_access`, `kf_refresh`). Client mutations use `/api/proxy/...` so the Bearer token never touches `localStorage`.

## Roles

- **Supporter** — `/dashboard/supporter` (contributions, buy credits)
- **Creator** — `/dashboard/creator` (campaigns, approve pledges, withdrawals)
- **Admin** — `/dashboard/admin` (users, campaign moderation, withdrawal queue)

## Env

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Express API base |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Elements |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Identity button |
