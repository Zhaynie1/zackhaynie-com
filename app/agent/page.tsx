import type { Metadata } from "next";
import { topJobs, stats, dbConfigured } from "@/lib/db";
import { companies, profile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Job agent",
  description:
    "A live pipeline that pulls postings from Greenhouse, Lever and Ashby, scores each one with Claude, and drafts outreach.",
};

function scoreColor(score: number) {
  if (score >= 85) return "var(--accent)";
  if (score >= 70) return "var(--ink)";
  return "var(--ink-dim)";
}

function ago(iso: string | null) {
  if (!iso) return "never";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function AgentPage() {
  const [summary, jobs] = await Promise.all([stats(), topJobs(30)]);

  return (
    <>
      <section className="section" style={{ borderTop: 0, paddingTop: 72 }}>
        <div className="wrap">
          <span className="mono eyebrow">Live system</span>
          <h1 className="display">The job agent</h1>
          <p className="lede" style={{ marginTop: 24 }}>
            Every morning this pipeline polls {companies.length} companies&apos;
            job boards, filters them down, and asks Claude how well each
            surviving posting actually fits me. This page is its output — not a
            screenshot of it.
          </p>

          <div className="stat-grid" style={{ marginTop: 44 }}>
            <div className="stat">
              <div className="stat-value">{summary.total.toLocaleString()}</div>
              <div className="stat-label mono">Postings seen</div>
            </div>
            <div className="stat">
              <div className="stat-value">{summary.scored.toLocaleString()}</div>
              <div className="stat-label mono">Scored by Claude</div>
            </div>
            <div className="stat">
              <div className="stat-value" style={{ color: "var(--accent)" }}>
                {summary.matches.toLocaleString()}
              </div>
              <div className="stat-label mono">Real matches (70+)</div>
            </div>
            <div className="stat">
              <div className="stat-value">{summary.companies}</div>
              <div className="stat-label mono">Companies</div>
            </div>
          </div>

          <p className="mono" style={{ marginTop: 16, color: "var(--ink-dim)" }}>
            Last run {ago(summary.lastRun)}
          </p>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="section">
        <div className="wrap">
          <span className="mono eyebrow">How it works</span>
          <ol className="steps">
            <li>
              <strong>Collect.</strong> A scheduled job hits the public posting
              APIs for Greenhouse, Lever and Ashby. No scraping, no headless
              browser — these boards publish clean JSON, and a dead board never
              takes down the run.
            </li>
            <li>
              <strong>Filter cheaply first.</strong> Title matching, location
              matching, and a dedup against everything already stored. There is
              no reason to spend model tokens learning that &ldquo;VP of
              Sales&rdquo; is a bad fit.
            </li>
            <li>
              <strong>Score what survives.</strong> Each new posting goes to
              Claude with a strict output schema: a 0&ndash;100 fit score, the
              specific reasons, and a two-sentence opener that has to cite
              something concrete from the posting.
            </li>
            <li>
              <strong>Digest, don&apos;t spam.</strong> Anything scoring{" "}
              {profile.scoreThreshold}+ lands in a daily email. The agent drafts;
              it never sends on my behalf. Auto-applying at volume is how you
              become noise.
            </li>
          </ol>
        </div>
      </section>

      {/* ---------- results ---------- */}
      <section className="section">
        <div className="wrap">
          <span className="mono eyebrow">Top matches</span>

          {!dbConfigured && (
            <div className="notice">
              <p style={{ margin: 0 }}>
                No database connected yet. Set <code>DATABASE_URL</code> and{" "}
                <code>ANTHROPIC_API_KEY</code> in your environment, then hit{" "}
                <code>/api/cron/scrape</code> to populate this page. See{" "}
                <code>SETUP.md</code> for the walkthrough.
              </p>
            </div>
          )}

          {dbConfigured && jobs.length === 0 && (
            <div className="notice">
              <p style={{ margin: 0 }}>
                Database is connected but the agent hasn&apos;t run yet. Trigger
                it with <code>curl /api/cron/scrape</code>, or wait for the next
                scheduled run.
              </p>
            </div>
          )}

          {jobs.map((job) => (
            <article className="job" key={job.id}>
              <div className="job-head">
                <div>
                  <div className="mono" style={{ color: "var(--ink-dim)" }}>
                    {job.company} · {job.location || "Location unspecified"} ·
                    found {ago(job.found_at)}
                  </div>
                  <h3
                    className="display"
                    style={{ fontSize: "1.2rem", margin: "6px 0 0" }}
                  >
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      {job.title} ↗
                    </a>
                  </h3>
                </div>
                <div
                  className="score"
                  style={{ color: scoreColor(job.score ?? 0) }}
                >
                  {job.score}
                </div>
              </div>

              {job.verdict && (
                <p style={{ margin: "14px 0 0", color: "var(--ink-mid)" }}>
                  {job.verdict}
                </p>
              )}

              {job.reasons && job.reasons.length > 0 && (
                <ul>
                  {job.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}

              {job.opener && <p className="opener">{job.opener}</p>}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
