import type { Metadata } from "next";
import Link from "next/link";
import { topJobs, stats, dbConfigured } from "@/lib/db";
import { companies, profile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Job agent · ${profile.name}`,
  description:
    "A live pipeline that reads job postings across a watchlist of companies, scores them with Claude, and drafts outreach.",
};

function ago(iso: string | null) {
  if (!iso) return "never";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export default async function AgentPage() {
  const [summary, jobs] = await Promise.all([stats(), topJobs(40)]);

  return (
    <>
      <section className="hero">
        <div className="wrap center stack-md">
          <p className="t-label">Live system</p>
          <h1 className="t-hero" style={{ fontSize: "clamp(2.4rem,6vw,4rem)" }}>
            The job agent
          </h1>
          <p className="t-sub measure" style={{ marginInline: "auto" }}>
            Every morning it reads the public job boards of {companies.length}{" "}
            companies, narrows them down, and asks Claude how well each survivor
            actually fits me. This page is its output.
          </p>
          <p className="t-label" style={{ marginTop: 8 }}>
            Last run {ago(summary.lastRun)}
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="stats">
            <div className="stat">
              <div className="stat-n">{summary.total.toLocaleString()}</div>
              <div className="stat-l">Postings read</div>
            </div>
            <div className="stat">
              <div className="stat-n">{summary.scored.toLocaleString()}</div>
              <div className="stat-l">Scored by Claude</div>
            </div>
            <div className="stat">
              <div className="stat-n">{summary.matches.toLocaleString()}</div>
              <div className="stat-l">Real matches</div>
            </div>
            <div className="stat">
              <div className="stat-n">{summary.companies}</div>
              <div className="stat-l">Companies watched</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap wrap-narrow">
          <p className="t-label" style={{ marginBottom: 18 }}>
            How it works
          </p>
          <div className="prose">
            <p>
              <strong>Collect.</strong> A scheduled job hits the public posting
              APIs for Greenhouse, Lever and Ashby. No scraping and no headless
              browser. Those boards publish clean JSON, and one dead board never
              takes down the run.
            </p>
            <p>
              <strong>Filter cheaply first.</strong> Title, location, and a check
              against everything already seen. Around 4,500 postings become about
              37. There is no reason to spend model tokens learning that a
              Director of Sales role is a bad fit.
            </p>
            <p>
              <strong>Score what survives.</strong> Each new posting goes to
              Claude with a strict schema: a 0 to 100 score, the specific reasons,
              and a draft opener. The prompt is told exactly what I can and
              can&apos;t do, including that I don&apos;t write code, so it scores
              hands-on engineering roles low on purpose.
            </p>
            <p>
              <strong>Draft, never send.</strong> Matches land in a daily digest.
              The agent has never sent an email on my behalf and isn&apos;t
              wired to. Auto-applying at volume is how you become noise.
            </p>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <p className="t-label" style={{ marginBottom: 20 }}>
            Every posting it scored
          </p>

          {jobs.length === 0 && (
            <div className="notice">
              {dbConfigured
                ? "No completed run yet. Check back shortly."
                : "Agent not configured in this environment."}
            </div>
          )}

          {jobs.map((job) => (
            <article className="match" key={job.id}>
              <div className="match-top">
                <div>
                  <div className="match-co">
                    {job.company} · {job.location || "Location unspecified"} ·
                    found {ago(job.found_at)}
                  </div>
                  <h3 className="match-title">
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      {job.title}
                    </a>
                  </h3>
                </div>
                <div
                  className={`score${(job.score ?? 0) >= 70 ? " score-high" : ""}`}
                >
                  {job.score}
                </div>
              </div>

              {job.verdict && <p>{job.verdict}</p>}

              {job.reasons && job.reasons.length > 0 && (
                <ul
                  style={{
                    margin: "14px 0 0",
                    paddingLeft: 20,
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    color: "var(--ink-2)",
                  }}
                >
                  {job.reasons.map((r, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      {r}
                    </li>
                  ))}
                </ul>
              )}

              {job.opener && (
                <div className="opener">
                  <span className="t-label">Drafted opener</span>
                  {job.opener}
                </div>
              )}
            </article>
          ))}

          <p className="center" style={{ marginTop: 40 }}>
            <Link href="/#top" className="link-arrow">
              <span aria-hidden>←</span> Back to the work
            </Link>
          </p>
        </div>
      </section>

      <section className="contact">
        <div className="wrap stack-md">
          <h2 className="t-section">Hiring?</h2>
          <p>
            <a href={`mailto:${profile.email}`} className="email-xl">
              {profile.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
