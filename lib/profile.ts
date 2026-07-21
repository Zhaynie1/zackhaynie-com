/**
 * Everything the job agent needs to know about you, in one place.
 * Edit this file to retarget the agent. You should never need to touch
 * the scoring or scraping code.
 */

export const profile = {
  name: "Zack Haynie",
  headline: "I ship software by directing AI",
  location: "Shawnee, Oklahoma (open to remote)",
  email: "zack@zackhaynie.com",
  site: "https://zackhaynie.com",

  /** Fed to Claude as the "who is this candidate" context when scoring roles. */
  summary: `Zack Haynie ships working software by directing AI coding agents. He is
not a hands-on programmer: he does not write implementation code, and cannot
read or author most of it unassisted. What he does is decide what gets built,
specify it, evaluate whether the output is actually correct, catch it when it
isn't, and drive it to something that ships. Every project below is real,
finished, and running. The implementation was produced by AI under his
direction.

What he has shipped:

- Three slot games on the Stake Engine platform, including Sakura Storm: a
  6x5 pay-anywhere game whose math model holds a 0.97 return across three bet
  modes with a 25,000x max win and a 1-in-400 bonus rate, verified over
  millions of simulated rounds and passed third-party certification. He owned
  the specification and the judgement calls across the full build: volatility
  feel, when the math was wrong, when the animation timing read as broken.

- Jarvis, a local-first voice assistant that keeps its identity and memory in
  a Python service rather than in any one model, routes between a local model
  and a cloud model by request type, and holds a vector store of past
  conversations so it survives model swaps.

- The job agent running on this site: it polls public job-board APIs across a
  watchlist of companies, filters ~4,500 postings down to a few dozen, scores
  those with Claude against this profile, and drafts outreach.

He is fluent in the surrounding craft that AI does not do for you: scoping a
system, reading output critically, debugging by bisecting behaviour, and
operating the infrastructure: DNS, deployment, environment configuration,
API keys, cron, databases.

Looking for: roles built around directing AI to produce software. AI-native
product work, prompt and agent engineering, technical operations, solutions
and forward-deployed work, QA of AI output, or a team explicitly hiring
builders rather than credentialed engineers.`,

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

  /** Hard exclusions, filtered out before Claude ever sees them (saves tokens). */
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
   * boundaries. A bare "us" as a substring also matches "Australia".
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
   * Dropped even if they say "remote". Remote-from-Buenos-Aires is not a
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
 * do move. If a company stops showing up, its slug probably changed.
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
