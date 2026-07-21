# zackhaynie.com

Portfolio site plus a live job agent, in one Next.js app.

The agent polls 18 companies' public job boards, filters them down
deterministically, scores the survivors against my profile with Claude, and
publishes the results at `/agent`. It is the portfolio piece and the job search
at the same time.

## Layout

```
app/
  page.tsx              portfolio homepage
  agent/page.tsx        live dashboard for the job agent
  api/cron/scrape       fetch -> filter -> score -> store   (daily)
  api/cron/digest       email the day's matches             (daily)
  api/jobs              public JSON of what's been found
  api/preview           dry run: fetch + filter, no model, no writes
lib/
  profile.ts            you, your filters, and the company watchlist
  projects.ts           portfolio content
  sources.ts            Greenhouse / Lever / Ashby clients + prefilter
  score.ts              Claude scoring with a strict output schema
  db.ts                 Postgres (Neon)
```

## How the funnel works

Measured on a real run: **4,536 postings fetched → 37 passed the deterministic
filters → those 37 go to the model.** Cheap filters first is the whole trick;
paying a frontier model to reject "VP of Sales, Sydney" 4,499 times would be
silly.

Scoring uses `client.messages.parse()` with a Zod schema, so the response is
guaranteed to contain a numeric score, structured reasons, and a draft opener —
no string parsing, no retries on malformed JSON.

The agent **drafts but never sends**. Auto-applying at volume is spam.

## Running it

```bash
npm install
npm run dev
```

Works with zero environment variables — the portfolio renders and the agent
page shows an empty state. See **[SETUP.md](./SETUP.md)** for the full
walkthrough: domain, Vercel, email, database, API keys.

## Environment

| Variable | Required for | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Scoring | console.anthropic.com |
| `DATABASE_URL` | Storing results | Neon pooled connection string |
| `CRON_SECRET` | Protecting cron routes | Any long random string |
| `RESEND_API_KEY` | Digest email | Optional |
| `DIGEST_FROM` / `DIGEST_TO` | Digest email | Optional |

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Anthropic SDK ·
Zod · Neon Postgres · Resend · Vercel Cron
