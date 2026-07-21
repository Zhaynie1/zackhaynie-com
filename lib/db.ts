import { neon } from "@neondatabase/serverless";

/**
 * Postgres (Neon). The whole app degrades gracefully when DATABASE_URL is
 * unset — the portfolio renders fine, the agent dashboard just shows an
 * empty state. That means `npm run dev` works before you've set anything up.
 */
const url = process.env.DATABASE_URL;
const sql = url ? neon(url) : null;

export const dbConfigured = Boolean(url);

export type Job = {
  id: string;
  company: string;
  title: string;
  location: string;
  url: string;
  posted_at: string | null;
  found_at: string;
  score: number | null;
  verdict: string | null;
  reasons: string[] | null;
  opener: string | null;
  status: "new" | "drafted" | "applied" | "skipped";
};

let initialized = false;

/** Idempotent schema creation. Cheap enough to call before every query. */
export async function initSchema() {
  if (!sql || initialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id          TEXT PRIMARY KEY,
      company     TEXT NOT NULL,
      title       TEXT NOT NULL,
      location    TEXT NOT NULL DEFAULT '',
      url         TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      posted_at   TIMESTAMPTZ,
      found_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      score       INTEGER,
      verdict     TEXT,
      reasons     JSONB,
      opener      TEXT,
      status      TEXT NOT NULL DEFAULT 'new'
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS jobs_score_idx ON jobs (score DESC NULLS LAST)`;
  initialized = true;
}

/**
 * Drop rows we stored but never managed to score. Without this, a run that
 * fails at the scoring step poisons those postings forever — they'd count as
 * "seen" and never be retried.
 */
export async function deleteUnscored(): Promise<number> {
  if (!sql) return 0;
  await initSchema();
  const rows = (await sql`
    DELETE FROM jobs WHERE score IS NULL RETURNING id
  `) as { id: string }[];
  return rows.length;
}

/**
 * Wipe every stored posting so the next run re-scores from scratch. Used when
 * the scoring prompt changes and old scores are no longer comparable.
 */
export async function deleteAll(): Promise<number> {
  if (!sql) return 0;
  await initSchema();
  const rows = (await sql`DELETE FROM jobs RETURNING id`) as { id: string }[];
  return rows.length;
}

/** Returns the ids that are NOT already in the table. */
export async function filterUnseen(ids: string[]): Promise<Set<string>> {
  if (!sql || ids.length === 0) return new Set(ids);
  await initSchema();
  const rows = (await sql`SELECT id FROM jobs WHERE id = ANY(${ids})`) as {
    id: string;
  }[];
  const seen = new Set(rows.map((r) => r.id));
  return new Set(ids.filter((id) => !seen.has(id)));
}

export async function insertJob(job: {
  id: string;
  company: string;
  title: string;
  location: string;
  url: string;
  description: string;
  postedAt: string | null;
  score: number | null;
  verdict: string | null;
  reasons: string[] | null;
  opener: string | null;
}) {
  if (!sql) return;
  await initSchema();
  await sql`
    INSERT INTO jobs (id, company, title, location, url, description, posted_at, score, verdict, reasons, opener)
    VALUES (${job.id}, ${job.company}, ${job.title}, ${job.location}, ${job.url},
            ${job.description}, ${job.postedAt}, ${job.score}, ${job.verdict},
            ${JSON.stringify(job.reasons)}, ${job.opener})
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function topJobs(limit = 25): Promise<Job[]> {
  if (!sql) return [];
  await initSchema();
  return (await sql`
    SELECT id, company, title, location, url, posted_at, found_at,
           score, verdict, reasons, opener, status
    FROM jobs
    WHERE score IS NOT NULL
    ORDER BY score DESC, found_at DESC
    LIMIT ${limit}
  `) as Job[];
}

/** Everything scored above the threshold and first seen in the last `hours`. */
export async function recentMatches(threshold: number, hours = 24): Promise<Job[]> {
  if (!sql) return [];
  await initSchema();
  return (await sql`
    SELECT id, company, title, location, url, posted_at, found_at,
           score, verdict, reasons, opener, status
    FROM jobs
    WHERE score >= ${threshold}
      AND found_at > now() - (${hours} * INTERVAL '1 hour')
    ORDER BY score DESC
  `) as Job[];
}

export async function stats() {
  if (!sql) {
    return { total: 0, scored: 0, matches: 0, companies: 0, lastRun: null as string | null };
  }
  await initSchema();
  const [row] = (await sql`
    SELECT
      count(*)                                        AS total,
      count(score)                                    AS scored,
      count(*) FILTER (WHERE score >= 70)             AS matches,
      count(DISTINCT company)                         AS companies,
      max(found_at)                                   AS last_run
    FROM jobs
  `) as {
    total: string;
    scored: string;
    matches: string;
    companies: string;
    last_run: string | null;
  }[];
  return {
    total: Number(row?.total ?? 0),
    scored: Number(row?.scored ?? 0),
    matches: Number(row?.matches ?? 0),
    companies: Number(row?.companies ?? 0),
    lastRun: row?.last_run ?? null,
  };
}
