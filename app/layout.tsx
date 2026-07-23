import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { profile } from "@/lib/profile";
import { NavAnchor } from "./nav-anchor";
import { GitHubMark } from "./github-mark";
import "./globals.css";

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: `${profile.name} · ${profile.headline}`,
  description:
    "I ship working software by directing AI. Certified game math, a local-first assistant, and a job agent running live on this site.",
  openGraph: {
    title: `${profile.name} · ${profile.headline}`,
    description:
      "I ship working software by directing AI. See what I've shipped, and watch the job agent run.",
    url: profile.site,
    siteName: profile.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={sans.variable}>
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
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
