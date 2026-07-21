import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { profile } from "./profile";
import type { RawJob } from "./sources";

const FitSchema = z.object({
  score: z
    .number()
    .describe("Fit from 0-100. Be honest and use the full range — most roles are not a 90."),
  verdict: z
    .string()
    .describe("One sentence, plain language, on whether this is worth applying to and why."),
  reasons: z
    .array(z.string())
    .describe("2-4 concrete bullet points. Cite specifics from the posting, not generalities."),
  opener: z
    .string()
    .describe(
      "Two sentences he could actually send. Reference something specific from THIS posting " +
        "and tie it to a specific thing he built. No 'I am excited about your mission.'",
    ),
});

export type Fit = z.infer<typeof FitSchema>;

const SYSTEM = `You are screening job postings for one specific engineer. Your job is to
protect his time: he would rather see five real matches than fifty maybes.

Be a harsh grader. Score honestly across the full 0-100 range:
  85-100  strong match, he should apply today
  70-84   worth applying, some gaps
  40-69   plausible but a stretch
  0-39    not a fit

Penalize heavily for: required years of experience he clearly doesn't have,
required degrees, deep domain specialization unrelated to his work, or a stack
with no overlap. Do not inflate a score because a company is well known.

Here is the candidate:

${profile.summary}

Primary skills: ${profile.skills.join(", ")}`;

export const modelConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

const client = modelConfigured ? new Anthropic() : null;

/** Populated when a scoring call throws, so the cron route can report why. */
export const scoreErrors: string[] = [];

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
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`scoring failed for ${job.id}:`, err);
    scoreErrors.push(msg.slice(0, 400));
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
