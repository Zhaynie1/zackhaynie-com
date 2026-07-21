import { NextResponse } from "next/server";
import { topJobs, stats } from "@/lib/db";

/** Public read-only view of what the agent has found. */
export async function GET() {
  const [jobs, summary] = await Promise.all([topJobs(50), stats()]);
  return NextResponse.json({ stats: summary, jobs });
}
