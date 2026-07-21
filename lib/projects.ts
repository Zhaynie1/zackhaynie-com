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
  /**
   * A public, third-party-hosted place to go play or see the thing. This is
   * the strongest proof there is, so it renders as the primary button.
   * On launch day, fill this in and delete `pending` below.
   */
  live?: { label: string; href: string };
  /** Shown instead of `live` while the thing is not publicly available yet. */
  pending?: string;
  links?: { label: string; href: string }[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "sakura-storm",
    title: "Sakura Storm",
    tagline:
      "A 6×5 slot game whose payout model holds a 0.97 return across three bet modes, verified over millions of simulated rounds and passed third-party certification.",
    year: "2026",
    status: "shipped",
    kind: "Game · Certified",
    featured: true,
    stack: ["Stake Engine", "Python", "TypeScript", "Svelte", "PixiJS"],
    body: [
      "Slot math is a constrained optimization problem. You are given a target return, a hit frequency, a max win cap and a volatility profile, and the reel set and payout table have to satisfy all four at once. Then it has to survive an audit by someone whose job is to find where you got it wrong.",
      "I specified the game and drove it to certification. The judgement calls were mine: how volatile it should feel, when the numbers coming back were wrong rather than merely surprising, when a cascade animation read as broken instead of dramatic, and when it was actually finished.",
      "Certification is a useful forcing function, because it removes the option of \"close enough.\" A payout distribution is either provably correct across millions of rounds or it does not ship. Getting there meant a lot of runs where the answer was no.",
      "It has passed both front end and math certification. It is now in final platform review ahead of release, and I will link it here the day it goes live.",
    ],
    role: "Specified the game, tuned the model against certification targets, and owned the call on when it was correct. Implementation produced by AI under my direction.",

    // On release: replace `pending` with
    //   live: { label: "Play it on Stake Engine", href: "https://..." },
    pending: "Certified. In final review ahead of release.",

    facts: [
      { label: "Return to player", value: "0.97 across all 3 bet modes" },
      { label: "Max win", value: "25,000×" },
      { label: "Bonus trigger", value: "1 in 400 spins" },
      { label: "Certification", value: "Front end and math passed" },
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
      "The most honest thing you can build while job hunting is the thing that solves your own job hunt. So this one runs in public, and you can read its output below.",
      "Each morning it polls the public job-board APIs of a watchlist of companies. Cheap deterministic filters run first, checking title, location, and everything already seen, because there is no reason to spend model tokens learning that a Director of Sales role is a bad fit. About 4,500 postings become about 37.",
      "Those go to Claude with a strict schema: a 0 to 100 fit score, the specific reasons, and a draft opener. Anything above the bar lands in a daily digest.",
      "Two decisions I would defend. It drafts but never sends, because auto-applying at volume is how you become spam, and the goal was never to apply to more jobs. It was to only look at the ones that matter. And it is instructed to be harsh about my gaps. An early version rated every single posting exactly 72 and wrote openers claiming experience I do not have. That version was useless, and worse, dishonest. The current one routinely scores roles in the single digits and says why.",
    ],
    role: "Designed the pipeline, caught the scoring model hedging and fabricating, and rewrote the prompt until it told the truth.",
    facts: [
      { label: "Read per run", value: "~4,500 postings" },
      { label: "Survive filtering", value: "~37" },
      { label: "Scored by", value: "Claude, structured output" },
      { label: "Sends on my behalf", value: "Never. Drafts only." },
    ],
    links: [{ label: "See what it found", href: "#agent" }],
  },
  {
    slug: "jarvis",
    title: "Jarvis",
    tagline:
      "A home assistant whose identity and memory live in a service rather than in any one model, so swapping the model never changes who it is.",
    year: "2026",
    status: "in progress",
    kind: "AI infrastructure",
    featured: true,
    stack: ["Python", "FastAPI", "Ollama", "Chroma", "Claude API"],
    body: [
      "Most assistant projects are a thin wrapper around one model, so the day you swap models you lose the personality, the memory, and everything it knew about your house. The design decision here was to invert that. Identity lives in a service that sits between you and whichever model is answering.",
      "It keeps a file of durable household facts injected into every conversation, plus a searchable store of past ones. Routing is by request type. Anything latency-sensitive stays on the model running locally on the GPU, open-ended questions go to the cloud, and if the cloud call fails it quietly falls back rather than dying.",
      "Vision runs entirely on the local machine. Camera frames never leave the house. That was a requirement, not an optimization.",
    ],
    role: "Set the architecture constraints, including local-first, model-agnostic identity, and no camera data leaving the house, then drove the build against them.",
    facts: [
      { label: "Local model", value: "Runs on-device, on GPU" },
      { label: "Vision", value: "Never leaves the machine" },
      { label: "Memory", value: "Durable facts + conversation recall" },
      { label: "Model swaps", value: "Identity survives them" },
    ],
  },
  {
    slug: "vault-legacy",
    title: "Vault Legacy",
    tagline:
      "A 3×3, nine-line slot with a pick-em bonus. Math model and front end are both finished at a 0.965 return and a 10,000× cap. It has not been launched.",
    year: "2026",
    status: "in progress",
    kind: "Game · Built, unlaunched",
    featured: true,
    stack: ["Stake Engine", "Python", "TypeScript", "Svelte", "PixiJS"],
    body: [
      "A smaller, tighter game than Sakura Storm on purpose. Three reels, three rows, nine fixed paylines, and a Key to Fortune pick-em bonus where the top box is a routed max win rather than a lucky roll.",
      "The constraint I set was that the paytable, symbols and paylines had to be defined once and mirrored exactly between the Python math model and the TypeScript front end. If those two ever drift, the game pays out something different from what it displays, and you will not find out until someone else does.",
      "Everything is built and the numbers hold. I have not put it through certification or launched it, and I am not going to claim otherwise.",
    ],
    role: "Set the game design and the mirroring constraint between math and front end, and verified the model held its targets.",
    facts: [
      { label: "Return to player", value: "0.965" },
      { label: "Max win", value: "10,000×" },
      { label: "Layout", value: "3×3, nine fixed lines" },
      { label: "Status", value: "Complete, not launched" },
    ],
  },
  {
    slug: "hoard",
    title: "Hoard",
    tagline:
      "A Roblox game about rolling around absorbing junk until you are huge, slow, and a target. My first programming project of any kind.",
    year: "2026",
    status: "in progress",
    kind: "Game · Roblox",
    stack: ["Roblox", "Lua"],
    body: [
      "You roll, you absorb junk, you grow. Big means slow and visible. Small means fast and ignorable. The whole thing is 646 lines in a single server script, and it exists to answer one question before anything else gets built: is being huge, slow, and covered in junk actually fun?",
      "Two decisions in it I would make again. Everything is server-authoritative, so the player's machine never gets to say what it picked up or how big it is. In this genre that is not paranoia, it is the first thing anyone tries. And the number of junk pieces drawn on your body is capped independently of your actual hoard count, so someone who has absorbed thousands of items still renders cheaply.",
      "All the tuning values sit in a labelled block at the top of the file, so changing how the game feels never requires reading the logic underneath it. Player versus player, hoard scattering, rounds, saving, shops and art are all deliberately not built yet.",
    ],
    role: "My first project. Set the design question, made the server-authority and render-cap calls, and kept scope on the one thing that had to be proven first.",
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
