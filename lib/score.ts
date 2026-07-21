import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { profile } from "./profile";
import type { RawJob } from "./sources";

const FitSchema = z.object({
  score: z
    .number()
    .describe("Fit from 0-100. Use the full range. Most roles are not a 70."),
  verdict: z
    .string()
    .describe(
      "One sentence about Zack specifically, in the third person. Never write 'you', " +
        "and never write a conditional like 'worth applying if you have X' — you have " +
        "his full background, so decide.",
    ),
  reasons: z
    .array(z.string())
    .describe(
      "2-4 bullets naming a concrete requirement from the posting and whether Zack " +
        "actually meets it. Include at least one genuine gap.",
    ),
  opener: z
    .string()
    .describe(
      "Two sentences Zack could send today. Must name something specific from THIS " +
        "posting, and one real project from his background by name (Sakura Storm, " +
        "Jarvis, the job agent, Starpetal Harvest, Neon Ronin). Every claim must be " +
        "literally true of him. No placeholders, no brackets, no 'excited about your mission'.",
    ),
});

export type Fit = z.infer<typeof FitSchema>;

const SYSTEM = `You are screening job postings for ONE specific engineer, Zack Haynie.
His full background is below. You are not advising a generic candidate — you
know exactly who this is, so judge decisively.

## The candidate

${profile.summary}

Primary skills: ${profile.skills.join(", ")}

## Hard rules

1. NEVER invent experience. Zack has no professional employment history as a
   software engineer, no CS degree, and no production experience at scale.
   Critically: he does not write code himself — he directs AI agents that do.
   Never describe him as having personally implemented, engineered, coded, or
   architected anything. He specified it, judged it, and shipped it. If a
   posting requires hands-on coding ability, that is a real and disqualifying
   gap — say so plainly rather than papering over it.

2. NEVER write a conditional verdict. "Worth applying if you have distributed
   systems experience" is a non-answer: you know whether he does. He does not.
   Decide and commit.

3. Write about him in the third person. Not "you".

4. The opener must contain only claims that are literally true of him, and must
   name a real project (Sakura Storm, Jarvis, the job agent, Starpetal Harvest,
   Neon Ronin). Never emit a placeholder like [X] or [company]. If you cannot
   write an honest opener for this role, say so in one sentence instead.

## Scoring

Spread your scores. If everything lands in the same narrow band you are
hedging, which is the one thing that makes this tool useless.

  85-100  Strong. Self-taught / portfolio-driven candidates are explicitly
          welcome, or the stack is a direct hit on what he has built.
  65-84   Real shot. Some requirements unmet but the core work matches.
  35-64   Stretch. He could do the work but the posting screens him out on
          paper (years of experience, degree, scale).
  0-34    No. Wrong domain, wrong seniority, or requires credentials he lacks.

Weight heavily against: any role whose core is writing code by hand, live
coding interviews, "N+ years of professional experience" where N > 2, required
degrees, and deep specialization in a domain he has never touched (distributed
systems at scale, compilers, security, ML research).

Weight heavily FOR: roles about directing, evaluating, or operating AI systems
— prompt and agent engineering, AI product and QA work, forward-deployed and
solutions roles, technical operations — plus anything in games or simulation,
and any posting that explicitly values shipped work over credentials or says
AI-assisted development is welcome.

Do not inflate a score because the company is famous.`;

export const modelConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

const client = modelConfigured ? new Anthropic() : null;

/** Populated when a scoring call throws, so the cron route can report why. */
export const scoreErrors: string[] = [];

/**
 * Error messages from the SDK can quote the request — including the API key.
 * Never let one reach an HTTP response body or a log line intact.
 */
function redact(msg: string): string {
  return msg
    .replace(/sk-ant-[A-Za-z0-9_-]+/g, "sk-ant-***REDACTED***")
    .replace(/postgres(?:ql)?:\/\/[^\s"']+/gi, "postgres://***REDACTED***");
}

export async function scoreJob(job: RawJob): Promise<Fit | null> {
  if (!client) {
    scoreErrors.push("ANTHROPIC_API_KEY is not set");
    return null;
  }
  try {
    const response = await client.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: zodOutputFormat(FitSchema),
      },
      messages: [
        {
          role: "user",
          content: `Score this posting.

Company:  ${job.company}
Title:    ${job.title}
Location: ${job.location || "unspecified"}

Description:
${job.description || "(no description provided)"}`,
        },
      ],
    });
    if (!response.parsed_output) {
      scoreErrors.push(
        `no parsed_output (stop_reason=${response.stop_reason})`,
      );
    }
    return response.parsed_output ?? null;
  } catch (err) {
    const msg = redact(err instanceof Error ? err.message : String(err));
    console.error(`scoring failed for ${job.id}: ${msg}`);
    scoreErrors.push(msg.slice(0, 300));
    return null;
  }
}

/**
 * Score with bounded concurrency. Sequential would take forever on 40 jobs;
 * unbounded would trip rate limits.
 */
export async function scoreAll(
  jobs: RawJob[],
  concurrency = 4,
): Promise<Map<string, Fit>> {
  const out = new Map<string, Fit>();
  let cursor = 0;

  async function worker() {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      const fit = await scoreJob(job);
      if (fit) out.set(job.id, fit);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, jobs.length) }, worker),
  );
  return out;
}
