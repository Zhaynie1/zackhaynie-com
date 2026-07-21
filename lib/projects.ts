export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  status: "shipped" | "live" | "in progress";
  kind: string;
  stack: string[];
  body: string[];
  /** Concrete, checkable numbers. These are what recruiters actually read. */
  facts?: { label: string; value: string }[];
  /** What Zack personally decided or caught. The honest contribution line. */
  role?: string;
  links?: { label: string; href: string }[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "sakura-storm",
    title: "Sakura Storm",
    tagline:
      "A 6×5 slot game whose payout model holds a 0.97 return across three bet modes — verified over millions of simulated rounds, and passed third-party certification.",
    year: "2026",
    status: "shipped",
    kind: "Game · Certified",
    featured: true,
    stack: ["Stake Engine", "Python", "TypeScript", "Svelte", "PixiJS"],
    body: [
      "Slot math is a constrained optimization problem. You are given a target return, a hit frequency, a max win cap and a volatility profile, and the reel set and payout table have to satisfy all four at once — then survive an audit by someone whose job is to find where you got it wrong.",
      "I specified the game and drove it to certification. The judgement calls were mine: how volatile it should feel, when the numbers coming back were wrong rather than merely surprising, when a cascade animation read as broken instead of dramatic, and when it was actually finished.",
      "Certification is a useful forcing function, because it removes the option of \"close enough.\" A payout distribution is either provably correct across millions of rounds or it does not ship. Getting there meant a lot of runs where the answer was no.",
    ],
    role: "Specified the game, tuned the model against certification targets, and owned the call on when it was correct. Implementation produced by AI under my direction.",
    facts: [
      { label: "Return to player", value: "0.97 across all 3 bet modes" },
      { label: "Max win", value: "25,000×" },
      { label: "Bonus trigger", value: "1 in 400 spins" },
      { label: "Certification", value: "Passed third-party audit" },
    ],
  },
  {
    slug: "job-agent",
    title: "The job agent",
    tagline:
      "A pipeline that reads 4,500 job postings a day, narrows them to a few dozen, scores those against my profile, and drafts outreach. It is running on this site right now.",
    year: "2026",
    status: "live",
    kind: "AI automation · Live",
    featured: true,
    stack: ["Next.js", "TypeScript", "Claude API", "Postgres", "Cron"],
    body: [
      "The most honest thing you can build while job hunting is the thing that solves your own job hunt. So this one is running in public, and you can read its output below.",
      "Each morning it polls the public job-board APIs of a watchlist of companies. Cheap deterministic filters run first — title, location, and a check against everything already seen — because there is no reason to spend model tokens learning that a Director of Sales role is a bad fit. About 4,500 postings become about 37.",
      "Those go to Claude with a strict schema: a 0–100 fit score, the specific reasons, and a draft opener. Anything above the bar lands in a daily digest.",
      "Two decisions I'd defend. It drafts but never sends — auto-applying at volume is how you become spam, and the goal was never to apply to more jobs, it was to only look at the ones that matter. And it is instructed to be harsh about my gaps: an early version rated every single posting exactly 72 and wrote openers claiming experience I do not have. That version was useless, and worse, dishonest. The current one routinely scores roles in the single digits and says why.",
    ],
    role: "Designed the pipeline, caught the scoring model hedging and fabricating, and rewrote the prompt until it told the truth.",
    facts: [
      { label: "Read per run", value: "~4,500 postings" },
      { label: "Survive filtering", value: "~37" },
      { label: "Scored by", value: "Claude, structured output" },
      { label: "Sends on my behalf", value: "Never — drafts only" },
    ],
    links: [{ label: "See what it found", href: "#agent" }],
  },
  {
    slug: "jarvis",
    title: "Jarvis",
    tagline:
      "A home assistant whose identity and memory live in a service rather than in any one model — so swapping the model never changes who it is.",
    year: "2026",
    status: "in progress",
    kind: "AI infrastructure",
    featured: true,
    stack: ["Python", "FastAPI", "Ollama", "Chroma", "Claude API"],
    body: [
      "Most assistant projects are a thin wrapper around one model, so the day you swap models you lose the personality, the memory, and everything it knew about your house. The design decision here was to invert that: identity lives in a service that sits between you and whichever model is answering.",
      "It keeps a file of durable household facts injected into every conversation, plus a searchable store of past ones. Routing is by request type — anything latency-sensitive stays on the model running locally on the GPU, open-ended questions go to the cloud, and if the cloud call fails it quietly falls back rather than dying.",
      "Vision runs entirely on the local machine. Camera frames never leave the house. That was a requirement, not an optimization.",
    ],
    role: "Set the architecture constraints — local-first, model-agnostic identity, no camera data leaving the house — and drove the build against them.",
    facts: [
      { label: "Local model", value: "Runs on-device, on GPU" },
      { label: "Vision", value: "Never leaves the machine" },
      { label: "Memory", value: "Durable facts + conversation recall" },
      { label: "Model swaps", value: "Identity survives them" },
    ],
  },
  {
    slug: "neon-ronin",
    title: "Neon Ronin",
    tagline:
      "The Sakura Storm engine under a completely different theme — the test of whether the math and the presentation were genuinely separable.",
    year: "2026",
    status: "in progress",
    kind: "Game",
    stack: ["Stake Engine", "Python", "Svelte", "PixiJS"],
    body: [
      "If the math and the presentation are actually decoupled, you should be able to drop in a new art direction and theme without touching the certified payout model at all. Neon Ronin reuses that model byte-for-byte and changes everything above it.",
    ],
  },
  {
    slug: "starpetal",
    title: "Starpetal Harvest",
    tagline:
      "A 7×7 cluster-pays game with a tumble mechanic — where I learned how much of game feel is timing rather than art.",
    year: "2026",
    status: "shipped",
    kind: "Game",
    stack: ["Stake Engine", "Python", "Svelte", "PixiJS"],
    body: [
      "Symbols pay in connected clusters, clear, drop, and repeat until the board settles. The lesson that carried into everything after: whether a cascade reads as one continuous motion or as a series of stutters is a scheduling problem, and no amount of art fixes it.",
    ],
  },
  {
    slug: "freedom-septic",
    title: "Freedom Septic",
    tagline: "A working site for my brother's septic company in Shawnee, Oklahoma.",
    year: "2026",
    status: "live",
    kind: "Client work",
    stack: ["HTML", "CSS", "JavaScript"],
    body: [
      "No framework, fast on a bad connection. The constraint that mattered: most visitors are standing in a yard on one bar of signal with a problem that needs solving today.",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
