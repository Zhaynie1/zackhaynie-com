/**
 * The skills bar.
 *
 * Deliberately NOT self-rated percentages. "TypeScript 85%" is a number nobody
 * can check and everybody discounts. Bar length here encodes how much evidence
 * sits behind the skill, and every tier is defined against the projects listed
 * on this same page, so a reader can verify any bar by scrolling up.
 */

export type Level = 1 | 2 | 3;

export const levels: Record<Level, { name: string; meaning: string }> = {
  3: {
    name: "Shipped and audited",
    meaning: "Used in a product that passed independent certification",
  },
  2: {
    name: "Built with it",
    meaning: "Used to build something finished that runs",
  },
  1: {
    name: "Operate it",
    meaning: "Set it up and keep it running, but have not built on it",
  },
};

export const skills: { name: string; level: Level }[] = [
  { name: "Slot math modelling", level: 3 },
  { name: "RTP and volatility tuning", level: 3 },
  { name: "Monte Carlo simulation", level: 3 },
  { name: "Python", level: 3 },
  { name: "TypeScript", level: 3 },
  { name: "Stake Engine", level: 3 },
  { name: "Svelte", level: 3 },
  { name: "PixiJS and WebGL", level: 3 },

  { name: "Claude API and structured output", level: 2 },
  { name: "Prompt design and iteration", level: 2 },
  { name: "Agent pipelines and evals", level: 2 },
  { name: "Next.js and React", level: 2 },
  { name: "Postgres", level: 2 },
  { name: "FastAPI", level: 2 },
  { name: "RAG and vector search", level: 2 },
  { name: "Lua and Roblox", level: 2 },

  { name: "Vercel and Cloudflare", level: 1 },
  { name: "Cron and scheduled jobs", level: 1 },
  { name: "Ollama and local models", level: 1 },
];
