import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { profile } from "@/lib/profile";
import { NavAnchor } from "./nav-anchor";
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
              {profile.name}
            </NavAnchor>
            <nav className="nav-links">
              <NavAnchor id="work" className="nav-hide-sm">
                Work
              </NavAnchor>
              <NavAnchor id="agent" className="nav-hide-sm">
                Agent
              </NavAnchor>
              <a href="/Zachary-Haynie-Resume.pdf" className="nav-hide-sm">
                Resume
              </a>
              <a href={`mailto:${profile.email}`} className="btn btn-primary btn-sm">
                Email me
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
