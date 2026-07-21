import { NextResponse } from "next/server";
import { fetchAllJobs, prefilter } from "@/lib/sources";
import { isAuthorizedCron } from "@/lib/cron-auth";

/**
 * Dry run: fetch + filter only. No model calls, no database writes.
 * Use this to tune the filters in lib/profile.ts without spending anything.
 *   curl localhost:3000/api/preview | jq
 */
export const maxDuration = 120;

export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const all = await fetchAllJobs();
  const kept = prefilter(all);

  const byCompany: Record<string, number> = {};
  for (const j of all) byCompany[j.company] = (byCompany[j.company] ?? 0) + 1;

  return NextResponse.json({
    fetched: all.length,
    perCompany: byCompany,
    passedFilters: kept.length,
    sample: kept.slice(0, 20).map((j) => `${j.company}: ${j.title} (${j.location})`),
  });
}
