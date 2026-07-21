import { companies, profile, type BoardType } from "./profile";

export type RawJob = {
  /** Stable across runs so we can dedup: "greenhouse:anthropic:12345". */
  id: string;
  company: string;
  title: string;
  location: string;
  url: string;
  description: string;
  postedAt: string | null;
};

/** Strip HTML and collapse whitespace. Descriptions come back as markup. */
function textOf(html: string | undefined | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "zackhaynie.com job agent" },
      // These are third-party APIs polled on a cron, so never serve a cached copy.
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    // A single dead board should never take down the whole run.
    return null;
  }
}

async function fetchGreenhouse(company: string, slug: string): Promise<RawJob[]> {
  const data = (await getJson(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`,
  )) as { jobs?: Record<string, unknown>[] } | null;
  if (!data?.jobs) return [];
  return data.jobs.map((j) => ({
    id: `greenhouse:${slug}:${j.id}`,
    company,
    title: String(j.title ?? ""),
    location: String((j.location as { name?: string })?.name ?? ""),
    url: String(j.absolute_url ?? ""),
    description: textOf(j.content as string).slice(0, 6000),
    postedAt: (j.updated_at as string) ?? null,
  }));
}

async function fetchLever(company: string, slug: string): Promise<RawJob[]> {
  const data = (await getJson(
    `https://api.lever.co/v0/postings/${slug}?mode=json`,
  )) as Record<string, unknown>[] | null;
  if (!Array.isArray(data)) return [];
  return data.map((j) => ({
    id: `lever:${slug}:${j.id}`,
    company,
    title: String(j.text ?? ""),
    location: String((j.categories as { location?: string })?.location ?? ""),
    url: String(j.hostedUrl ?? ""),
    description: textOf(j.descriptionPlain as string).slice(0, 6000),
    postedAt: j.createdAt ? new Date(Number(j.createdAt)).toISOString() : null,
  }));
}

async function fetchAshby(company: string, slug: string): Promise<RawJob[]> {
  const data = (await getJson(
    `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
  )) as { jobs?: Record<string, unknown>[] } | null;
  if (!data?.jobs) return [];
  return data.jobs.map((j) => ({
    id: `ashby:${slug}:${j.id}`,
    company,
    title: String(j.title ?? ""),
    location: String(j.location ?? ""),
    url: String(j.jobUrl ?? ""),
    description: textOf(j.descriptionPlain as string).slice(0, 6000),
    postedAt: (j.publishedAt as string) ?? null,
  }));
}

const fetchers: Record<BoardType, (c: string, s: string) => Promise<RawJob[]>> = {
  greenhouse: fetchGreenhouse,
  lever: fetchLever,
  ashby: fetchAshby,
};

/** Poll every configured board in parallel. */
export async function fetchAllJobs(): Promise<RawJob[]> {
  const results = await Promise.all(
    companies.map((c) => fetchers[c.board](c.name, c.slug)),
  );
  return results.flat().filter((j) => j.title && j.url);
}

/**
 * Match `needle` as a whole phrase, not a bare substring. Without this,
 * "us" matches "aUStralia" and "Houston", which is exactly how a
 * Sydney-only role sneaks past a US-only filter.
 */
function hasPhrase(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(haystack);
}

/**
 * Deterministic pre-filter. This runs before the model so we never pay
 * tokens to be told that "VP of Sales, Frankfurt" isn't a match.
 */
export function prefilter(jobs: RawJob[]): RawJob[] {
  return jobs.filter((j) => {
    const title = j.title.toLowerCase();
    if (profile.excludeTitles.some((t) => hasPhrase(title, t.trim()))) return false;
    if (!profile.targetTitles.some((t) => title.includes(t))) return false;

    const loc = j.location.toLowerCase();
    // An empty location is usually "remote/unspecified", so keep it and let
    // the model decide rather than dropping it silently.
    if (loc) {
      if (profile.excludeLocations.some((k) => hasPhrase(loc, k))) return false;
      if (
        profile.locationKeywords.length > 0 &&
        !profile.locationKeywords.some((k) => hasPhrase(loc, k))
      ) {
        return false;
      }
    }
    return true;
  });
}
