export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  status: "shipped" | "live" | "in progress";
  /** Short label shown on the card. */
  kind: string;
  stack: string[];
  /** Paragraphs. First one is the hook. */
  body: string[];
  /** Concrete, checkable numbers. These are what recruiters actually read. */
  facts?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "sakura-storm",
    title: "Sakura Storm",
    tagline:
      "A 6×5 pay-anywhere slot built from scratch: a Python math engine tuned to a 0.97 return, and a WebGL front end that plays back every result at 60fps.",
    year: "2026",
    status: "shipped",
    kind: "Game engine + simulation",
    featured: true,
    stack: ["Python", "TypeScript", "Svelte", "PixiJS", "WebGL", "NumPy"],
    body: [
      "Slot math is a constrained optimization problem wearing a costume. You are handed a target return-to-player, a target hit frequency, a max win cap, and a volatility profile — then you have to construct a reel set and a payout table that hit all four simultaneously, and prove it over millions of simulated rounds.",
      "I wrote the simulation in Python on top of Stake Engine's math SDK: symbol distributions, cluster detection across a 6×5 grid, cascade resolution, free-spin state machine, and a multiplier system that compounds across tumbles. The optimizer then reweights the reel strips against generated lookup tables until all three bet modes land on the same 0.97 return without collapsing the volatility curve.",
      "The front end is a separate problem entirely. The math engine emits a book of events — 'these symbols landed, this cluster paid, this multiplier applied' — and the client has to render that deterministically. I built the presentation layer in Svelte with PixiJS handling the WebGL draw calls: sprite pooling for the symbol grid, a tween scheduler so cascades and win animations sequence correctly, and a state machine that can fast-forward or skip without ever desyncing from the book.",
      "The result passes third-party certification, which is a useful forcing function: there is no 'close enough' in a system where the payout distribution is audited.",
    ],
    facts: [
      { label: "Return to player", value: "0.97 across all 3 bet modes" },
      { label: "Max win", value: "25,000×" },
      { label: "Bonus trigger rate", value: "1 in 400 spins" },
      { label: "Buy features", value: "Spirit Storm 100× · Final Form 500×" },
      { label: "Grid", value: "6×5 pay-anywhere cluster w/ cascades" },
    ],
  },
  {
    slug: "job-agent",
    title: "This site's job agent",
    tagline:
      "A scheduled pipeline that pulls live postings from three job-board APIs, scores each one against my profile with Claude, and drafts tailored outreach. It is running right now.",
    year: "2026",
    status: "live",
    kind: "AI automation",
    featured: true,
    stack: ["TypeScript", "Next.js", "Claude API", "Postgres", "Vercel Cron"],
    body: [
      "The advice everyone gives job seekers is 'build something real.' The most honest version of that is to build the thing that solves the problem you actually have.",
      "Every morning a cron job hits the public posting APIs for Greenhouse, Lever, and Ashby across a watchlist of companies. Cheap deterministic filters run first — title matching, location matching, dedup against everything already seen — because there is no reason to spend model tokens deciding that a Director of Sales role is a bad fit.",
      "What survives goes to Claude with a structured-output schema: a 0–100 fit score, the specific reasons it matches or doesn't, and a two-sentence opener that references something concrete from the posting rather than the usual 'I am excited about your mission.' Anything above the threshold lands in a daily digest.",
      "One deliberate design decision: the agent drafts, it does not send. Auto-blasting applications is how you become spam. The interesting engineering problem was never 'how do I apply to more jobs' — it was 'how do I only look at the ten that matter.'",
    ],
    facts: [
      { label: "Sources", value: "Greenhouse · Lever · Ashby (public APIs)" },
      { label: "Schedule", value: "Daily scrape, then digest" },
      { label: "Model", value: "Claude Opus 4.8, structured output" },
      { label: "Cost control", value: "Deterministic filters run before the model" },
    ],
    links: [{ label: "Watch it work", href: "/agent" }],
  },
  {
    slug: "jarvis",
    title: "Jarvis",
    tagline:
      "A local-first voice assistant whose identity lives in the middleware, not the model — so swapping brains never changes who it is.",
    year: "2026",
    status: "in progress",
    kind: "AI infrastructure",
    featured: true,
    stack: ["Python", "FastAPI", "Ollama", "Chroma", "Claude API"],
    body: [
      "Most home assistant projects are a thin wrapper around one model. The moment you swap models, you lose the personality, the memory, and the household context. I inverted that: the identity lives in a Python service that sits between the interface and whatever model is answering.",
      "The service owns a durable facts file injected into every prompt, plus a Chroma vector store of past conversations that gets searched per request and gated by request type — a device command does not need to retrieve last week's conversation about dinner.",
      "Routing is the interesting part. Device-style commands and anything latency-sensitive stay on a local Ollama model running on the GPU. Open-ended questions route to Claude. If the cloud call fails, it silently falls back to local rather than dying. Vision runs entirely locally, so camera frames never leave the house.",
      "Everything is exposed over an OpenAI-compatible endpoint, which means Home Assistant can talk to it without knowing any of this exists.",
    ],
    facts: [
      { label: "Local brain", value: "Ollama · qwen3:14b" },
      { label: "Vision", value: "qwen2.5vl:7b — never leaves the machine" },
      { label: "Memory", value: "Durable facts + Chroma vector recall" },
      { label: "Interface", value: "OpenAI-compatible API for Home Assistant" },
    ],
  },
  {
    slug: "neon-ronin",
    title: "Neon Ronin",
    tagline:
      "A cyberpunk reskin of the Sakura Storm engine — proof that the math and the presentation were actually decoupled.",
    year: "2026",
    status: "in progress",
    kind: "Game engine",
    stack: ["Python", "TypeScript", "Svelte", "PixiJS"],
    body: [
      "The real test of whether you separated your math engine from your rendering layer is whether you can drop in a completely different art direction and theme without touching a single line of the simulation.",
      "Neon Ronin reuses the Sakura Storm math byte-for-byte — same reel strips, same certified payout distribution — under a new identity and a new visual language. Everything that changed lives in the presentation layer.",
    ],
  },
  {
    slug: "starpetal",
    title: "Starpetal Harvest",
    tagline:
      "A 7×7 cluster-pays slot with a tumble mechanic — the project where I learned how much of game feel is scheduling.",
    year: "2026",
    status: "shipped",
    kind: "Game engine",
    stack: ["Python", "TypeScript", "Svelte", "PixiJS"],
    body: [
      "Cluster-pays on a 7×7 grid means flood-filling connected symbol groups, paying them, removing them, dropping the remainder, and repeating until the board settles — all while the client animates each step in sequence.",
      "The lesson that carried into everything after: the hard part of game feel isn't the art, it's the scheduler. Getting a cascade to read as one continuous motion instead of a series of stutters is a timing problem, and timing problems are engineering problems.",
    ],
  },
  {
    slug: "freedom-septic",
    title: "Freedom Septic",
    tagline:
      "A real site for a real business — my brother's septic company in Shawnee, Oklahoma.",
    year: "2026",
    status: "live",
    kind: "Client work",
    stack: ["HTML", "CSS", "JavaScript"],
    body: [
      "Hand-built, no framework, fast on a bad rural connection. Services, gallery, quote request. The constraint that mattered was that most of the traffic is someone standing in a yard with one bar of signal and a problem that needs solving today.",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
