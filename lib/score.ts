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
        "and never write a conditional like 'worth applying if you have X'. You have " +
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
      "Two sentences Zack could send today, in his first person voice. Must name " +
        "something specific from THIS posting and one real project by name " +
        "(Sakura Storm, Vault Legacy, Jarvis, the job agent, Hoard). Every claim " +
        "must be literally true of him, and he does NOT write implementation code: " +
        "never write 'I built', 'I coded', 'I'm a developer' or 'hands-on'. He " +
        "directs AI, specifies, judges and ships. No placeholders, no brackets, " +
        "no 'excited about your mission'.",
    ),
});

export type Fit = z.infer<typeof FitSchema>;

/**
 * The style rule in the prompt gets followed most of the time, which is not
 * the same as always. Strip dashes deterministically so none reach the page.
 *   "end-to-end — from Jarvis"  ->  "end-to-end, from Jarvis"
 *   "a 0–100 score"             ->  "a 0 to 100 score"
 * Hyphens in compounds (end-to-end, 0-1, third-party) are left alone.
 */
function stripDashes(s: string): string {
  return s
    .replace(/(\d)\s*[—–]\s*(\d)/g, "$1 to $2")
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s*–\s*/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/\s+([,.])/g, "$1")
    .trim();
}

function clean(fit: Fit): Fit {
  return {
    ...fit,
    verdict: stripDashes(fit.verdict),
    reasons: fit.reasons.map(stripDashes),
    opener: stripDashes(fit.opener),
  };
}

const SYSTEM = `You are screening job postings for ONE specific engineer, Zack Haynie.
His full background is below. You are not advising a generic candidate. You
know exactly who this is, so judge decisively.

## The candidate

${profile.summary}

Primary skills: ${profile.skills.join(", ")}

## Hard rules

1. NEVER invent experience. Zack has no professional employment history as a
   software engineer, no CS degree, and no production experience at scale.
   Critically: he does not write code himself. He directs AI agents that do.
   Never describe him as having personally implemented, engineered, coded, or
   architected anything. He specified it, judged it, and shipped it. If a
   posting requires hands-on coding ability, that is a real and disqualifying
   gap, so say so plainly rather than papering over it.

2. NEVER write a conditional verdict. "Worth applying if you have distributed
   systems experience" is a non-answer: you know whether he does. He does not.
   Decide and commit.

3. Write about him in the third person. Not "you".

4. The opener is written in Zack's first person voice, and rule 1 applies to it
   with equal force. This is where it gets broken, because "I built X" is the
   default register for a job application and it is a false claim about him.

   BANNED, and these are real examples this prompt has produced:
     "I build AI tooling end-to-end"
     "I'm a US-based indie game developer"
     "I've shipped interactive front-end work"
     "my hands-on tooling"
   Each one asserts he personally wrote the implementation. He did not.

   WRITE INSTEAD, first person, accurate:
     "I direct AI agents to build things and judge whether the output is right"
     "I specified and shipped Sakura Storm"
     "I caught the scoring model rating every posting identically"
     "I don't write the implementation code, I decide what gets built and
      whether it's correct"

   Naming what he actually does is not a weakness to hide. It is the entire
   pitch, and a hiring manager who finds out later feels lied to.

5. Only these projects exist and may be named: Sakura Storm (certified, in
   final review at Stake), Vault Legacy (built, never launched, say so),
   Jarvis, the job agent, Hoard, Freedom Septic. Starpetal Harvest and Neon
   Ronin are unfinished and are NOT citable. Never claim a game is launched or
   playable when it is not.

6. Never name a technology he does not use. He uses Claude, not OpenAI's API.
   His game art is AI-generated to a brief, not pixel art he drew. If a posting
   wants a skill he lacks, say so in the opener rather than inventing adjacency.

7. Never emit a placeholder like [X] or [company]. If you cannot write an honest
   opener for this role, say so in one sentence instead.

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

Weight heavily FOR: roles about directing, evaluating, or operating AI systems,
such as prompt and agent engineering, AI product and QA work, forward-deployed
and solutions roles, and technical operations. Also anything in games or
simulation, and any posting that explicitly values shipped work over
credentials or says AI-assisted development is welcome.

Do not inflate a score because the company is famous.

## Style

Write plainly. Do not use em dashes or en dashes anywhere in your output. Use
a period, a comma, or a colon instead. Short sentences are fine. Avoid the
stock phrases that make writing read as machine-generated.`;

export const modelConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

const client = modelConfigured ? new Anthropic() : null;

/** Populated when a scoring call throws, so the cron route can report why. */
export const scoreErrors: string[] = [];

/**
 * Error messages from the SDK can quote the request, including the API key.
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
    return response.parsed_output ? clean(response.parsed_output) : null;
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
