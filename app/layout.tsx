import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { profile } from "@/lib/profile";
import { NavAnchor } from "./nav-anchor";
import { GitHubMark } from "./github-mark";
import { ThemeToggle } from "./theme-toggle";
import "./globals.css";

/**
 * Runs before first paint: reads the saved theme and stamps it on <html> so
 * there is no light/dark flash on load. Kept as a raw string in a blocking
 * inline <script> for exactly that reason (a React effect would run too late).
 */
const THEME_INIT = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Google Search Console verification token, from the "HTML tag" method:
 * Search Console -> add property zackhaynie.com -> HTML tag -> copy the
 * `content="..."` value (NOT the whole tag) in here, then redeploy. While it
 * is empty no verification tag is emitted, so we never ship a broken one.
 */
const GOOGLE_SITE_VERIFICATION = "ZpK2_Pv255MYT7bWUHsXK-2MiW1zCymeRH5d7XxxAbU";

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: `${profile.name} · ${profile.headline}`,
  description:
    "I ship working software by directing AI. Certified game math, a local-first assistant, and a job agent running live on this site.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} · ${profile.headline}`,
    description:
      "I ship working software by directing AI. See what I've shipped, and watch the job agent run.",
    url: profile.site,
    siteName: profile.name,
    type: "website",
  },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={sans.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <header className="nav">
          <div className="wrap nav-inner">
            <NavAnchor id="top" className="nav-brand">
              <span className="nav-hide-xs">{profile.name}</span>
              <span className="nav-only-xs">{profile.name.split(" ")[0]}</span>
            </NavAnchor>
            <nav className="nav-links">
              <NavAnchor id="work">Work</NavAnchor>
              <NavAnchor id="agent">Agent</NavAnchor>
              <a href="/Zachary-Haynie-Resume.pdf">Resume</a>
              {/*
                On phones the word "GitHub" is the first thing that has to go:
                the octocat is recognisable on its own, and dropping six
                characters is what lets the other three links stay.
              */}
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-github"
                aria-label="GitHub"
              >
                <span className="nav-hide-sm">GitHub</span>
                <span className="nav-only-sm" aria-hidden>
                  <GitHubMark />
                </span>
              </a>
              <a href={`mailto:${profile.email}`} className="btn btn-primary btn-sm">
                <span className="nav-hide-xs">Email me</span>
                <span className="nav-only-xs">Email</span>
              </a>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
