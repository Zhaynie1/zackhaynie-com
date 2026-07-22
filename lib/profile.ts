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
  github: "https://github.com/Zhaynie1",

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

Two things about him are genuinely scarce rather than merely presentable.

First, judging AI output is his actual craft, not a side effect of using it.
He has repeatedly caught models producing work that looked finished and was
wrong: a scoring pipeline that rated every input identically, outreach that
invented experience he does not have, animation logic that broke a payout
sequence while the numbers underneath stayed correct. Roles built around
evaluating, red-teaming, annotating or quality-checking model output are the
closest match to what he does all day.

Second, certified slot math is a small field. Sakura Storm passed independent
math and front end certification and is in final platform review at Stake. In
the general software market he is a non-traditional candidate; in game math he
holds an externally audited credential that very few applicants can produce.

Looking for: roles built around directing, deploying and judging AI rather
than hand-authoring code. AI training and evaluation, forward-deployed and
solutions work, implementation and technical account roles, AI operations and
automation, developer advocacy, technical writing, game math and game design,
or a small team explicitly hiring builders rather than credentialed engineers.

Not a fit, and should score low: roles requiring him to pass a live coding
interview, senior or staff engineering titles, deep systems work such as
security, infrastructure, compilers or C++, and anything gated on a computer
science degree or years of professional software employment.`,

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

  /**
   * Titles worth surfacing. Matched case-insensitively as plain substrings.
   *
   * The organising filter here is not industry, it is **does this role end in
   * a live coding interview**. Everything realistically winnable sits on the
   * other side of that line, because the implementation code is not his to
   * write. So the weight is on evaluating AI output, deploying it for
   * customers, and operating it, rather than authoring it.
   */
  targetTitles: [
    // 1. Judging AI output. The closest match to what he actually does, and
    // the corner of the market with the least credential gatekeeping.
    "ai trainer",
    "ai tutor",
    "model evaluation",
    "evaluation",
    "evals",
    "annotation",
    "human data",
    "data quality",
    "quality analyst",
    "red team",
    "domain expert",

    // 2. Taking AI to customers. Technical, demo-heavy, rarely a coding screen.
    "forward deployed",
    "forward-deployed",
    "solutions engineer",
    "solutions architect",
    "solutions consultant",
    "sales engineer",
    "implementation",
    "deployment",
    "onboarding",
    "technical account",
    "customer engineer",
    "professional services",
    "technical consultant",

    // 3. Operating AI inside a business.
    "prompt",
    "ai operations",
    "ai specialist",
    "ai analyst",
    "ai engineer",
    "applied ai",
    "agent engineer",
    "automation",
    "workflow",
    "ai enablement",
    "ai adoption",

    // 4. Explaining it. He writes clearly and directs AI to produce docs.
    "support engineer",
    "developer advocate",
    "developer relations",
    "developer experience",
    "technical writer",
    "documentation",

    // 5. Small-company generalist, where shipping beats credentials.
    "founding",
    "member of technical staff",
    "product engineer",
    "generalist",

    // 6. Games and game math. The certified Stake Engine model is a scarce,
    // externally audited credential, and this is the only market where he is
    // not the underdog.
    "game math",
    "mathematician",
    "game economy",
    "economy designer",
    "game designer",
    "systems designer",
    "gameplay",

    // 7. Kept deliberately out of priorityTitles below. These are mostly
    // coding-screen roles, so they should only be scored if budget is left
    // over after everything above has been looked at.
    "software engineer",
    "full stack",
    "fullstack",
    "full-stack",
  ],

  /**
   * Scored first when a run has more candidates than it can afford. Without
   * this the per-run budget gets eaten by whatever the boards happened to
   * return first, which is usually senior engineering roles.
   */
  priorityTitles: [
    "ai trainer",
    "model evaluation",
    "evals",
    "annotation",
    "human data",
    "forward deployed",
    "forward-deployed",
    "solutions",
    "implementation",
    "onboarding",
    "technical account",
    "customer engineer",
    "deployment",
    "applied ai",
    "ai engineer",
    "ai operations",
    "ai specialist",
    "prompt",
    "agent",
    "automation",
    "workflow",
    "developer advocate",
    "developer relations",
    "developer experience",
    "support engineer",
    "technical writer",
    "founding",
    "member of technical staff",
    "generalist",
    "game math",
    "mathematician",
    "game economy",
    "game designer",
  ],

  /**
   * Hard exclusions, filtered out before Claude ever sees them (saves tokens).
   * Matched on word boundaries, so "lead" never matches "leader".
   *
   * `senior` is the single most valuable line here. In one sample run it was
   * responsible for 25 of 50 scored postings, every one of them a senior
   * engineering role that scored under 62 and was never winnable. Excluding it
   * hands that budget to roles that are.
   *
   * Note the manager entries are specific rather than a bare "manager".
   * Technical Account Manager is a genuine target and a blanket exclusion
   * would silently delete it.
   */
  excludeTitles: [
    // Seniority he cannot credibly claim.
    "senior",
    "sr",
    "staff",
    "principal",
    "distinguished",
    "lead",
    "director",
    "vp",
    "head of",
    "chief",
    "engineering manager",
    "product manager",
    "program manager",
    "project manager",

    // Wrong function entirely.
    "recruiter",
    "recruiting",
    "account executive",
    "sales development",
    "marketing",
    "counsel",
    "attorney",
    "accountant",
    "controller",
    "payroll",
    "clinical",
    "nurse",

    // Deep systems work, which is the furthest thing from what he does.
    "security",
    "infrastructure",
    "compiler",
    "kernel",
    "c++",
    "embedded",
    "firmware",

    // Credential gates that are absolute, not negotiable.
    "intern",
    "phd",
    "research scientist",

    // AI-trainer roles are hired per domain, and the vendors post dozens of
    // them: "Geophysicist - AI Trainer", "BIM Coordinator - AI Trainer".
    // The format is a strong match; these particular domains are not his, and
    // without this they crowd out the ones that are. Software, game
    // development and design domains are deliberately absent from this list.
    "geophysicist",
    "geologist",
    "physics",
    "chemistry",
    "chemist",
    "biology",
    "biologist",
    "mechanical engineer",
    "hardware engineer",
    "electrical engineer",
    "civil engineer",
    "aerospace",
    "industrial designer",
    "architectural designer",
    "bim ",
    "music producer",
    "audio engineer",
    "audio editor",
    "video editor",
    "illustrator",
    "graphic designer",
    "translator",
    "linguist",
    "radiologist",
    "physician",
    "pharmacist",
    "veterinar",
    "structural engineer",
    "analog engineer",
    "rf engineer",
    "fluid dynamics",
    "drafter",
    "medical imaging",
    "qgis",
    "vectorworks",
    "rhino 3d",
    "3d slicer",
    "gimp",
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
    "philippines",
    "vietnam",
    "indonesia",
    "brazil",
    "argentina",
    "colombia",
    "mexico",
    "latam",
    "canada",
    "ireland",
    "london",
    "united kingdom",
    "germany",
    "poland",
    "netherlands",
    "sweden",
    "denmark",
    "norway",
    "finland",
    "france",
    "spain",
    "portugal",
    "italy",
    "switzerland",
    "austria",
    "belgium",
    "romania",
    "turkey",
    "israel",
    // Regional shorthands. Boards put these in the title as often as the
    // location field, e.g. "Solutions Architect - MENA", which is how two
    // of them slipped through a US-only filter in an earlier run.
    "emea",
    "apac",
    "mena",
    "middle east",
    "africa",
    "dubai",
    "united arab",
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

/**
 * The watchlist, ordered by how likely a real conversation is rather than by
 * how impressive the logo is.
 *
 * The previous version of this list was 26 household names. That reads like
 * ambition and behaves like a filter against you: maximum applicant volume,
 * mandatory coding screens, and resume screening on degree and years of
 * professional employment before a person ever reads it. Tier 4 keeps a few of
 * those because the cost of applying is twenty minutes. It should not be where
 * the search lives.
 *
 * Every slug verified against its live API on 2026-07-21.
 */
export const companies: { name: string; board: BoardType; slug: string }[] = [
  // ---------------------------------------------------------------------
  // Tier 1. Evaluating AI output, which is the literal job description of
  // what he does. These hire on demonstrated judgement, often start as
  // contract, and usually have no coding screen. Highest conversion odds
  // on the whole list.
  // ---------------------------------------------------------------------
  { name: "Mercor", board: "ashby", slug: "mercor" },
  { name: "Turing", board: "greenhouse", slug: "turing" },
  { name: "Snorkel AI", board: "greenhouse", slug: "snorkelai" },
  { name: "Handshake", board: "ashby", slug: "handshake" },
  { name: "Labelbox", board: "greenhouse", slug: "labelbox" },
  { name: "Invisible", board: "greenhouse", slug: "invisibletech" },
  { name: "Prolific", board: "greenhouse", slug: "prolific" },
  { name: "Appen", board: "lever", slug: "appen" },
  { name: "Encord", board: "ashby", slug: "encord" },
  { name: "Scale AI", board: "greenhouse", slug: "scaleai" },

  // ---------------------------------------------------------------------
  // Tier 2. Small companies that deploy AI for customers. Forward-deployed
  // and implementation work, where shipping something real counts for more
  // than a credential and a founder still reads applications.
  // ---------------------------------------------------------------------
  { name: "Distyl", board: "ashby", slug: "distyl" },
  { name: "Lorikeet", board: "ashby", slug: "lorikeet" },
  { name: "Pylon", board: "ashby", slug: "pylon" },
  { name: "Cresta", board: "greenhouse", slug: "cresta" },
  { name: "Parloa", board: "greenhouse", slug: "parloa" },
  { name: "Vellum", board: "ashby", slug: "vellum" },
  { name: "Decagon", board: "ashby", slug: "decagon" },
  { name: "Sierra", board: "ashby", slug: "sierra" },
  { name: "Harvey", board: "ashby", slug: "harvey" },
  { name: "Writer", board: "ashby", slug: "writer" },
  { name: "Replit", board: "ashby", slug: "replit" },
  { name: "Lovable", board: "ashby", slug: "lovable" },
  { name: "Gamma", board: "ashby", slug: "gamma" },
  { name: "LangChain", board: "ashby", slug: "langchain" },
  { name: "Modal", board: "ashby", slug: "modal" },
  { name: "Browserbase", board: "ashby", slug: "browserbase" },
  { name: "Zapier", board: "ashby", slug: "zapier" },

  // ---------------------------------------------------------------------
  // Tier 3. Games and betting, where the certified Stake Engine math model
  // is a scarce, independently audited credential rather than a hobby.
  //
  // Known gap: the dedicated slot studios (Light & Wonder, Aristocrat,
  // Everi, High 5, Playtika) are all on Workday or iCIMS, which this agent
  // cannot read. Those stay manual. Checked 2026-07-21.
  // ---------------------------------------------------------------------
  { name: "PrizePicks", board: "greenhouse", slug: "prizepicks" },
  { name: "Underdog", board: "greenhouse", slug: "underdogfantasy" },
  { name: "Kalshi", board: "greenhouse", slug: "kalshi" },
  { name: "Roblox", board: "greenhouse", slug: "roblox" },

  // ---------------------------------------------------------------------
  // Tier 4. Long shots, kept because applying is cheap. GitLab earned its
  // place: it produced the single highest-scoring posting in the first run
  // and is genuinely remote-first with unconventional hiring.
  //
  // Cut from the old list for producing nothing but senior engineering
  // postings: Cognition, Abridge, OpenEvidence, Notion, Linear, Vercel,
  // Perplexity.
  // ---------------------------------------------------------------------
  { name: "GitLab", board: "greenhouse", slug: "gitlab" },
  { name: "Anthropic", board: "greenhouse", slug: "anthropic" },
  { name: "OpenAI", board: "ashby", slug: "openai" },
  { name: "Cursor", board: "ashby", slug: "cursor" },
  { name: "ElevenLabs", board: "ashby", slug: "elevenlabs" },
];
