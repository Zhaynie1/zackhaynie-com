import Link from "next/link";
import { profile } from "@/lib/profile";
import { featuredProjects, otherProjects, type Project } from "@/lib/projects";
import { topJobs, stats, dbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="project" id={project.slug}>
      <p className="t-label" style={{ marginBottom: 14 }}>
        {project.kind}
      </p>

      <h3 className="t-project">{project.title}</h3>

      <p className="t-sub measure-wide" style={{ margin: "18px 0 32px" }}>
        {project.tagline}
      </p>

      <div className="prose">
        {project.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {project.role && (
        <p className="role-note">
          <strong>My part:</strong> {project.role}
        </p>
      )}

      {project.facts && (
        <dl className="facts">
          {project.facts.map((f) => (
            <div className="fact" key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <ul className="chips">
        {project.stack.map((s) => (
          <li className="chip" key={s}>
            {s}
          </li>
        ))}
      </ul>

      {project.links?.map((l) => (
        <p key={l.href} style={{ margin: "28px 0 0" }}>
          <a href={l.href} className="link-arrow">
            {l.label} <span aria-hidden>→</span>
          </a>
        </p>
      ))}
    </article>
  );
}

export default async function Home() {
  const [summary, matches] = await Promise.all([stats(), topJobs(3)]);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero" id="top">
        <div className="wrap center stack-md">
          {summary.total > 0 && (
            <div className="rise">
              <span className="badge">
                <span className="dot" aria-hidden />
                Agent live — {summary.total.toLocaleString()} postings read
              </span>
            </div>
          )}

          <h1 className="t-hero rise d1">I ship software I don&apos;t write.</h1>

          <p className="t-sub measure rise d2" style={{ marginInline: "auto" }}>
            I&apos;m not a programmer. I direct AI coding agents — I decide what gets
            built, judge whether it&apos;s actually right, and drive it until it
            ships.
          </p>

          <div className="hero-actions rise d3" style={{ marginTop: 36 }}>
            <a href={`mailto:${profile.email}`} className="btn btn-primary">
              {profile.email}
            </a>
            <a href="#work" className="btn btn-ghost">
              See the work
            </a>
          </div>
        </div>
      </section>

      {/* ================= HOW I WORK ================= */}
      <section className="section-tight">
        <div className="wrap">
          <div className="card">
            <p className="t-label">How I work</p>
            <h2 className="t-section" style={{ margin: "16px 0 20px" }}>
              The code isn&apos;t mine.
              <br />
              The judgement is.
            </h2>
            <p className="t-body measure-wide" style={{ marginBottom: 44 }}>
              I can&apos;t write most of the code in these projects, and I
              won&apos;t pretend otherwise. What I can do is take something from
              an idea to a finished, working, audited product — which turns out
              to be a different skill, and a scarcer one than it used to be.
            </p>

            <div className="pillars">
              <div className="pillar">
                <h3>Decide what gets built</h3>
                <p>
                  Scope, constraints, and the sequence to build in. Most failed
                  projects die here, long before anyone writes a line.
                </p>
              </div>
              <div className="pillar">
                <h3>Judge whether it&apos;s right</h3>
                <p>
                  AI is confidently wrong all the time. Catching that is the
                  job — a payout model that doesn&apos;t hold, a filter that
                  quietly matches the wrong thing.
                </p>
              </div>
              <div className="pillar">
                <h3>Get it over the line</h3>
                <p>
                  Certification, DNS, deployment, keys, cron, databases. The
                  unglamorous distance between &ldquo;it runs&rdquo; and
                  &ldquo;it&apos;s live.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORK ================= */}
      <section className="section" id="work">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 24 }}>
            <p className="t-label">Selected work</p>
            <h2 className="t-section" style={{ marginTop: 14 }}>
              Shipped, not prototyped.
            </h2>
          </div>

          {featuredProjects.map((p) => (
            <FeaturedProject key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* ================= ALSO ================= */}
      <section className="section-tight">
        <div className="wrap">
          <p className="t-label" style={{ marginBottom: 20 }}>
            Also shipped
          </p>
          <div className="rows">
            {otherProjects.map((p) => (
              <div className="row" key={p.slug}>
                <h3>{p.title}</h3>
                <span>{p.kind}</span>
                <p>{p.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= AGENT ================= */}
      <section className="section" id="agent">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 48 }}>
            <p className="t-label">Running right now</p>
            <h2 className="t-section" style={{ margin: "14px 0 18px" }}>
              A job agent, working in public.
            </h2>
            <p className="t-sub measure" style={{ marginInline: "auto" }}>
              It reads every posting across a watchlist of companies each
              morning, scores the survivors against my profile, and drafts the
              opener. Below is its actual output.
            </p>
          </div>

          <div className="stats" style={{ marginBottom: 44 }}>
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

          {matches.length === 0 ? (
            <div className="notice">
              {dbConfigured
                ? "The agent hasn't completed a run yet. Check back shortly."
                : "Agent not configured in this environment."}
            </div>
          ) : (
            matches.map((job) => (
              <article className="match" key={job.id}>
                <div className="match-top">
                  <div>
                    <div className="match-co">
                      {job.company} · {job.location || "Location unspecified"}
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

                {job.opener && (
                  <div className="opener">
                    <span className="t-label">Drafted opener</span>
                    {job.opener}
                  </div>
                )}
              </article>
            ))
          )}

          <p className="center" style={{ marginTop: 36 }}>
            <Link href="/agent" className="link-arrow">
              See everything it found <span aria-hidden>→</span>
            </Link>
          </p>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="contact" id="contact">
        <div className="wrap stack-md">
          <p className="t-label">Get in touch</p>
          <h2 className="t-section">Looking for my next role.</h2>
          <p className="t-sub measure" style={{ marginInline: "auto" }}>
            Best fit is a team that wants someone who can take an idea to shipped
            using AI — and who tells you plainly how it got built.
          </p>
          <p style={{ marginTop: 12 }}>
            <a href={`mailto:${profile.email}`} className="email-xl">
              {profile.email}
            </a>
          </p>
        </div>
      </section>

      <div className="wrap">
        <div className="foot">
          <span>
            {profile.name} · {profile.location}
          </span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </div>
    </>
  );
}
