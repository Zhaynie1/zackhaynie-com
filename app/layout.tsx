import type { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk, JetBrains_Mono, Inter_Tight } from "next/font/google";
import { profile } from "@/lib/profile";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: `${profile.name} — ${profile.headline}`,
    template: `%s — ${profile.name}`,
  },
  description:
    "Game engines, AI automation, and full-stack work. Including a job agent that is looking for my next role right now.",
  openGraph: {
    title: `${profile.name} — ${profile.headline}`,
    description:
      "Game engines, AI automation, and full-stack work — plus a job agent running live.",
    url: profile.site,
    siteName: profile.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <header className="nav">
          <div className="wrap nav-inner">
            <Link href="/" className="brand">
              {profile.name}
            </Link>
            <nav className="nav-links mono">
              <Link href="/#work">Work</Link>
              <Link href="/agent">Agent</Link>
              <a href={`mailto:${profile.email}`}>Email</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="section">
          <div className="wrap">
            <p className="mono" style={{ color: "var(--ink-dim)", margin: 0 }}>
              {profile.name} · {profile.location}
            </p>
            <p style={{ margin: "10px 0 0" }}>
              <a href={`mailto:${profile.email}`} className="link-accent">
                {profile.email}
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
