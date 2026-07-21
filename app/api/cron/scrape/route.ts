import { NextResponse } from "next/server";
import { fetchAllJobs, prefilter } from "@/lib/sources";
import { scoreAll, modelConfigured, scoreErrors } from "@/lib/score";
import {
  filterUnseen,
  insertJob,
  deleteUnscored,
  deleteAll,
  dbConfigured,
} from "@/lib/db";
import { isAuthorizedCron } from "@/lib/cron-auth";

/** Scoring N postings with a frontier model takes longer than the default 15s. */
export const maxDuration = 300;

/** Don't score more than this per run. Bounds both runtime and spend. */
const MAX_PER_RUN = 25;

export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!dbConfigured || !modelConfigured) {
    return NextResponse.json(
      { error: "DATABASE_URL and ANTHROPIC_API_KEY must both be set" },
      { status: 503 },
    );
  }

  const started = Date.now();

  // ?rescore=1 wipes stored postings first, for when the prompt changed and
  // old scores are no longer comparable.
  const rescore = new URL(request.url).searchParams.get("rescore") === "1";
  const cleared = rescore ? await deleteAll() : 0;

  const retried = rescore ? 0 : await deleteUnscored();

  const all = await fetchAllJobs();
  const candidates = prefilter(all);

  const unseenIds = await filterUnseen(candidates.map((j) => j.id));
  const fresh = candidates.filter((j) => unseenIds.has(j.id)).slice(0, MAX_PER_RUN);

  const fits = await scoreAll(fresh);

  for (const job of fresh) {
    const fit = fits.get(job.id);
    await insertJob({
      ...job,
      score: fit?.score ?? null,
      verdict: fit?.verdict ?? null,
      reasons: fit?.reasons ?? null,
      opener: fit?.opener ?? null,
    });
  }

  return NextResponse.json({
    ok: true,
    fetched: all.length,
    passedFilters: candidates.length,
    new: fresh.length,
    requeued: retried,
    cleared,
    scored: fits.size,
    // Surfaced so a failing run is diagnosable without digging through logs.
    errors: [...new Set(scoreErrors)].slice(0, 3),
    ms: Date.now() - started,
  });
}
