import Link from "next/link";
import { profile } from "@/lib/profile";
import { featuredProjects, otherProjects, type Project } from "@/lib/projects";
import { stats } from "@/lib/db";

/** The homepage reads live agent stats, so it renders per request. */
export const dynamic = "force-dynamic";

function Facts({ facts }: { facts: NonNullable<Project["facts"]> }) {
  return (
    <dl className="facts">
      {facts.map((f) => (
        <div className="fact" key={f.label}>
          <dt className="mono">{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="project" id={project.slug}>
      <div className="project-head">
        <h3 className="display">{project.title}</h3>
        <span className="mono" style={{ color: "var(--ink-dim)" }}>
          {project.kind} · {project.year}
        </span>
      </div>

      <p className="lede" style={{ maxWidth: "60ch", marginBottom: 24 }}>
        {project.tagline}
      </p>

      <div className="prose">
        {project.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {project.facts && <Facts facts={project.facts} />}

      <ul className="tags" style={{ marginTop: 22 }}>
        {project.stack.map((s) => (
          <li className="tag" key={s}>
            {s}
          </li>
        ))}
      </ul>

      {project.links && (
        <p style={{ marginTop: 20, marginBottom: 0 }}>
          {project.links.map((l) => (
            <Link key={l.href} href={l.href} className="link-accent">
              {l.label} →
            </Link>
          ))}
        </p>
      )}
    </article>
  );
}

export default async function Home() {
  const summary = await stats();

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="section" style={{ borderTop: 0, paddingTop: 96 }}>
        <div className="wrap">
          <span className="mono eyebrow">{profile.location}</span>

          <h1 className="display">
            I build systems that
            <br />
            have to actually work.
          </h1>

          <p className="lede" style={{ marginTop: 28 }}>
            Certified slot-game math engines, a local-first AI assistant, and a
            job agent that is out looking for my next role while you read this.
          </p>

          <p style={{ marginTop: 32, marginBottom: 0 }}>
            <a href={`mailto:${profile.email}`} className="link-accent">
              {profile.email}
            </a>
          </p>

          {summary.total > 0 && (
            <p
              className="mono"
              style={{ marginTop: 40, marginBottom: 0, color: "var(--ink-mid)" }}
            >
              <span className="live-dot" aria-hidden />
              Agent has scanned {summary.total.toLocaleString()} postings across{" "}
              {summary.companies} companies ·{" "}
              <Link href="/agent" className="link-accent">
                watch it
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* ---------- featured work ---------- */}
      <section className="section" id="work">
        <div className="wrap">
          <span className="mono eyebrow">Selected work</span>
          {featuredProjects.map((p) => (
            <FeaturedProject key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* ---------- also ---------- */}
      <section className="section">
        <div className="wrap">
          <span className="mono eyebrow">Also built</span>
          <div className="compact">
            {otherProjects.map((p) => (
              <div className="compact-row" key={p.slug}>
                <strong>{p.title}</strong>
                <span className="mono" style={{ color: "var(--ink-dim)" }}>
                  {p.kind}
                </span>
                <p>{p.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- about ---------- */}
      <section className="section" id="about">
        <div className="wrap">
          <span className="mono eyebrow">About</span>
          <h2 className="display" style={{ marginBottom: 24 }}>
            Self-taught, and the receipts all ship.
          </h2>
          <div className="prose">
            <p>
              I learned to program by building things that had to hold up under
              real constraints — a payout distribution that gets audited, a
              latency budget for a voice assistant, a rural customer with one bar
              of signal. That turns out to be a much better teacher than
              tutorials.
            </p>
            <p>
              What I keep coming back to is the seam between simulation and
              presentation: a system that computes something true, and an
              interface that makes it legible without lying about it. Slot math
              and LLM agents are the same problem wearing different clothes.
            </p>
            <p>
              I&apos;m looking for engineering work where I own a system end to
              end. If that sounds like something you have,{" "}
              <a href={`mailto:${profile.email}`} className="link-accent">
                email me
              </a>
              .
            </p>
          </div>

          <ul className="tags" style={{ marginTop: 32 }}>
            {profile.skills.map((s) => (
              <li className="tag" key={s}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
