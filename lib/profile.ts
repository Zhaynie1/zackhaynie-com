/**
 * Everything the job agent needs to know about you, in one place.
 * Edit this file to retarget the agent — you should never need to touch
 * the scoring or scraping code.
 */

export const profile = {
  name: "Zack Haynie",
  headline: "Software engineer — game systems, AI automation, full-stack",
  location: "Shawnee, Oklahoma (open to remote)",
  email: "zack@zackhaynie.com",
  site: "https://zackhaynie.com",

  /** Fed to Claude as the "who is this candidate" context when scoring roles. */
  summary: `Self-taught software engineer who ships complete products end to end.

Built and certified three real-money-grade slot games on the Stake Engine
platform — each one is a Python math engine (millions of simulated rounds,
RTP tuned to 0.97 across three bet modes, 25,000x max win, lookup-table
optimization) paired with a Svelte + PixiJS WebGL front end that renders the
results at 60fps. That means comfort with: simulation, probability, numerical
optimization, real-time graphics, state machines, and a strict spec that has
to survive third-party certification.

Also built Jarvis, a local-first voice assistant: FastAPI service that owns
identity and memory, routes between a local Ollama model and the Claude API
based on request type, and keeps a Chroma vector store of past conversations
so the assistant persists across model swaps.

And this site's job agent — a scheduled pipeline that pulls live postings from
Greenhouse, Lever, and Ashby job boards, scores each one against my profile
with Claude, and drafts tailored outreach. It is running right now.

Looking for: engineering roles where I own a system end to end. Strongest on
TypeScript, Python, and applied-AI plumbing (agents, RAG, tool use, evals).`,

  /** Skills the agent should treat as strong matches. */
  skills: [
    "TypeScript",
    "Python",
    "React",
    "Next.js",
    "Svelte",
    "Node.js",
    "PixiJS / WebGL",
    "FastAPI",
    "Claude API / LLM tool use",
    "RAG & vector search",
    "Simulation & numerical optimization",
    "Postgres",
    "Lua / Roblox",
  ],

  /** Titles worth surfacing. Matched case-insensitively as substrings. */
  targetTitles: [
    "software engineer",
    "full stack",
    "fullstack",
    "full-stack",
    "frontend",
    "front end",
    "front-end",
    "backend",
    "back end",
    "back-end",
    "product engineer",
    "ai engineer",
    "applied ai",
    "forward deployed",
    "solutions engineer",
    "game engineer",
    "gameplay engineer",
    "games programmer",
    "developer",
  ],

  /** Hard exclusions — filtered out before Claude ever sees them (saves tokens). */
  excludeTitles: [
    "staff",
    "principal",
    "distinguished",
    "director",
    "vp ",
    "head of",
    "manager",
    "recruiter",
    "sales",
    "marketing",
    "account executive",
    "intern",
    "phd",
  ],

  /**
   * Keep postings whose location matches one of these. Matched on word
   * boundaries — a bare "us" as a substring also matches "Australia".
   * Empty list = keep everything.
   */
  locationKeywords: [
    "remote",
    "united states",
    "usa",
    "u.s.",
    "anywhere",
    "oklahoma",
  ],

  /**
   * Dropped even if they say "remote" — remote-from-Buenos-Aires is not a
   * role I can take. Checked before locationKeywords.
   */
  excludeLocations: [
    "australia",
    "india",
    "singapore",
    "japan",
    "korea",
    "china",
    "brazil",
    "argentina",
    "colombia",
    "mexico",
    "canada",
    "ireland",
    "london",
    "united kingdom",
    "germany",
    "poland",
    "netherlands",
    "sweden",
    "france",
    "spain",
    "israel",
    "emea",
    "apac",
  ],

  /** Postings scored at or above this make it into the digest. 0-100. */
  scoreThreshold: 70,
};

/**
 * Public job boards to poll. All three APIs are unauthenticated.
 *   greenhouse -> https://boards-api.greenhouse.io/v1/boards/{slug}/jobs
 *   lever      -> https://api.lever.co/v0/postings/{slug}
 *   ashby      -> https://api.ashbyhq.com/posting-api/job-board/{slug}
 *
 * To add a company: open its careers page, look at the URL. If it's
 * job-boards.greenhouse.io/foo -> {board: "greenhouse", slug: "foo"}.
 *
 * Every slug below was verified against its live API on 2026-07-21. Boards
 * do move — if a company stops showing up, its slug probably changed.
 */
export type BoardType = "greenhouse" | "lever" | "ashby";

export const companies: { name: string; board: BoardType; slug: string }[] = [
  { name: "Anthropic", board: "greenhouse", slug: "anthropic" },
  { name: "OpenAI", board: "ashby", slug: "openai" },
  { name: "Vercel", board: "greenhouse", slug: "vercel" },
  { name: "Linear", board: "ashby", slug: "linear" },
  { name: "Ramp", board: "ashby", slug: "ramp" },
  { name: "Notion", board: "ashby", slug: "notion" },
  { name: "Figma", board: "greenhouse", slug: "figma" },
  { name: "Replit", board: "ashby", slug: "replit" },
  { name: "Perplexity", board: "ashby", slug: "perplexity" },
  { name: "Sierra", board: "ashby", slug: "sierra" },
  { name: "ElevenLabs", board: "ashby", slug: "elevenlabs" },
  { name: "Scale AI", board: "greenhouse", slug: "scaleai" },
  { name: "Discord", board: "greenhouse", slug: "discord" },
  { name: "Cloudflare", board: "greenhouse", slug: "cloudflare" },
  { name: "Stripe", board: "greenhouse", slug: "stripe" },
  { name: "Databricks", board: "greenhouse", slug: "databricks" },
  { name: "Spotify", board: "lever", slug: "spotify" },
  { name: "Shield AI", board: "lever", slug: "shieldai" },
];
