# Setup — domain, hosting, email, and the agent

Follow this top to bottom. Each part works on its own, so you can stop after
any step and still have something live. Total cost: **~$11/year** (the domain).
Everything else is a free tier.

---

## Part 1 — Buy the domain (10 min, ~$11/yr)

Buy it at **Cloudflare Registrar**. Two reasons: they sell at wholesale cost
with no renewal markup, and the free email routing in Part 4 needs your DNS to
live at Cloudflare anyway. Buying it there means you skip a nameserver migration.

1. Go to https://dash.cloudflare.com and make an account.
2. Left sidebar → **Domain Registration** → **Register Domain**.
3. Search `zackhaynie.com`. (I checked on 2026-07-21 — it was available.)
4. Buy it. Leave **WHOIS privacy ON** — otherwise your home address is public.
5. Turn on 2FA on this account. It now controls your email.

> Already bought it somewhere else (Namecheap, GoDaddy)? Fine. Add the site to
> Cloudflare as a **Website** instead, and change the nameservers at your
> registrar to the two Cloudflare gives you. Wait a few hours, then continue.

---

## Part 2 — Put the code on GitHub (5 min)

From this folder:

```powershell
cd C:\Users\zackh\dev\zackhaynie-com
git init
git add .
git commit -m "Portfolio site and job agent"
gh repo create zackhaynie-com --private --source=. --push
```

Private is the right call — your `.env.local` is gitignored, but the repo also
contains your résumé positioning and target-company list.

---

## Part 3 — Deploy to Vercel (10 min, free)

1. https://vercel.com → **Sign up with GitHub**.
2. **Add New → Project** → pick `zackhaynie-com` → **Deploy**.
3. It builds in ~60 seconds and gives you a `something.vercel.app` URL. The
   portfolio already works at this point.

### Point the domain at it

4. In Vercel: **Project → Settings → Domains** → add `zackhaynie.com` and
   `www.zackhaynie.com`.
5. Vercel will display the exact DNS records it wants. **Use the values Vercel
   shows you**, not values from any tutorial — they change. It's typically:
   - an `A` record on `@` pointing at a Vercel IP
   - a `CNAME` on `www` pointing at `cname.vercel-dns.com`
6. Add those in Cloudflare: **your domain → DNS → Records → Add record**.
7. **Important:** set the proxy status to **DNS only** (grey cloud, not orange).
   Orange-cloud proxying in front of Vercel causes redirect loops.
8. Wait 2–10 minutes. Vercel will flip the domain to "Valid Configuration" and
   issue the HTTPS certificate automatically.

`https://zackhaynie.com` is now live.

---

## Part 4 — Email at your domain, read in Gmail (15 min, free)

This gives you `zack@zackhaynie.com` that lands in your existing Gmail inbox,
and lets you *send* from that address too. No new inbox to check.

### 4a. Receiving

1. Cloudflare → your domain → **Email** → **Email Routing** → **Get started**.
2. Cloudflare offers to add the required MX and TXT records for you. **Accept.**
3. Create a routing rule:
   - Custom address: `zack@zackhaynie.com`
   - Action: **Send to an email**
   - Destination: `zackhaynie0@gmail.com`
4. Cloudflare emails that Gmail address a verification link. Click it.
5. Also create a **catch-all** rule → forward to the same Gmail. Then
   `anything@zackhaynie.com` reaches you, and you can hand out
   `hi@`, `hire@`, `agent@` without configuring each one.

Test it: send mail from your phone to `zack@zackhaynie.com`. It should land in
Gmail within a minute.

### 4b. Sending (so replies come *from* your domain)

Forwarding only handles inbound. If you hit reply, it still goes out as
`zackhaynie0@gmail.com` — which defeats the point. Fix that:

1. You need an **app password** for Gmail. That requires 2FA on your Google
   account. Turn it on: https://myaccount.google.com/security
2. Then go to https://myaccount.google.com/apppasswords, create one named
   "Domain mail", and copy the 16-character code.
3. Gmail → **Settings (gear) → See all settings → Accounts and Import**.
4. Next to *"Send mail as"* click **Add another email address**.
   - Name: `Zack Haynie`
   - Email: `zack@zackhaynie.com`
   - **Uncheck** "Treat as an alias"
   - Next step →
5. SMTP settings:
   - SMTP Server: `smtp.gmail.com`
   - Port: `587`
   - Username: `zackhaynie0@gmail.com`
   - Password: **the 16-character app password from step 2**
   - Secured connection using **TLS**
6. Gmail sends a confirmation code to `zack@zackhaynie.com` — which forwards
   back to your Gmail. Paste the code in.
7. Back in *Accounts and Import*, set **"Reply from the same address the
   message was sent to."**

Now mail sent to your domain arrives in Gmail, and your replies go out as
`zack@zackhaynie.com`. Send a test to yourself and check the "from" line.

---

## Part 5 — Turn the job agent on (20 min, free)

The site works without this; the `/agent` page just shows an empty state.

### 5a. Database (Neon, free tier)

1. https://neon.tech → sign up → **Create project**.
2. Copy the **Pooled connection** string. It looks like:
   `postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`
3. Vercel → **Settings → Environment Variables** → add `DATABASE_URL` with
   that value, for all three environments.

You don't need to create any tables — the app creates its own schema on first
use.

### 5b. Claude API key

1. https://console.anthropic.com → **API keys** → **Create key**.
2. Add **$5** of credit under Billing. That is a lot of scoring — each posting
   costs well under a cent, and the deterministic filters mean only ~30 of
   4,500 postings ever reach the model.
3. Vercel → env var `ANTHROPIC_API_KEY`.

### 5c. Cron secret

The cron endpoints cost money to run, so they refuse unauthenticated requests
in production. Generate a secret:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Vercel → env var `CRON_SECRET`. Vercel automatically sends this as
`Authorization: Bearer <secret>` on scheduled runs — you don't wire anything up.

### 5d. Deploy and kick it off

Env vars only apply to *new* deployments. Redeploy:

```powershell
git commit --allow-empty -m "Enable agent"
git push
```

Then trigger the first run by hand:

```powershell
curl.exe -H "Authorization: Bearer YOUR_CRON_SECRET" https://zackhaynie.com/api/cron/scrape
```

It takes a minute or two. Then open `https://zackhaynie.com/agent`.

### 5e. Daily digest email (optional)

1. https://resend.com → sign up → **Domains** → add `zackhaynie.com`.
2. Resend gives you DKIM/SPF records. Add them in Cloudflare DNS (**DNS only**,
   grey cloud). Wait for Resend to show "Verified".
3. **API Keys** → create one.
4. Vercel env vars:
   - `RESEND_API_KEY` — the key
   - `DIGEST_FROM` — `agent@zackhaynie.com`
   - `DIGEST_TO` — `zack@zackhaynie.com`

You now get one email a day listing only the postings that scored 70+.

---

## Schedules

`vercel.json` runs the scrape at 12:00 UTC and the digest at 12:30 UTC daily.

**Vercel's free Hobby plan allows 2 cron jobs, once per day each.** That is
what's configured. On the Pro plan you can change `"0 12 * * *"` to
`"0 */6 * * *"` for every six hours.

---

## Tuning the agent

Almost everything you'd want to change lives in **`lib/profile.ts`**:

| What | Where |
|---|---|
| How Claude describes you when scoring | `profile.summary` |
| Job titles to look for / never look at | `targetTitles`, `excludeTitles` |
| Locations to accept / reject | `locationKeywords`, `excludeLocations` |
| Score needed to reach the digest | `scoreThreshold` |
| Which companies to watch | `companies` |

To add a company, open its careers page and read the URL:

| Careers URL contains | Add this |
|---|---|
| `job-boards.greenhouse.io/foo` | `{ name: "Foo", board: "greenhouse", slug: "foo" }` |
| `jobs.lever.co/foo` | `{ name: "Foo", board: "lever", slug: "foo" }` |
| `jobs.ashbyhq.com/foo` | `{ name: "Foo", board: "ashby", slug: "foo" }` |

After editing, dry-run the filters **without spending anything**:

```powershell
npm run dev
# in another terminal:
curl.exe http://localhost:3000/api/preview
```

That endpoint fetches and filters but never calls the model or writes to the
database. It reports how many postings each company returned and shows you the
first 20 that survived — use it to check that a new company's slug works and
that your filters aren't too tight or too loose.

---

## Editing the portfolio

- **Projects** — `lib/projects.ts`. Set `featured: true` to give a project the
  full write-up treatment on the homepage; leave it off for the compact list.
- **Your name, headline, email, location** — `lib/profile.ts`.
- **Colors and type** — `app/globals.css`, top of the file. Light and dark are
  both defined; the site follows the visitor's system setting.
- **Homepage copy** — `app/page.tsx`.

---

## Running locally

```powershell
cd C:\Users\zackh\dev\zackhaynie-com
copy .env.example .env.local   # fill in what you have; blanks are fine
npm run dev
```

Open http://localhost:3000. With no environment variables at all, the portfolio
renders and `/agent` shows a "not configured yet" notice — nothing crashes.
