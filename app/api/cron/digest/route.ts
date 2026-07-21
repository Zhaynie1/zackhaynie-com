import { NextResponse } from "next/server";
import { Resend } from "resend";
import { recentMatches, dbConfigured } from "@/lib/db";
import { profile } from "@/lib/profile";
import { isAuthorizedCron } from "@/lib/cron-auth";

export const maxDuration = 60;

export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!dbConfigured) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 503 });
  }

  const matches = await recentMatches(profile.scoreThreshold, 24);
  if (matches.length === 0) {
    return NextResponse.json({ ok: true, matches: 0, sent: false });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.DIGEST_FROM;
  const to = process.env.DIGEST_TO;
  if (!apiKey || !from || !to) {
    // Email isn't configured yet, so still report what we found.
    return NextResponse.json({ ok: true, matches: matches.length, sent: false });
  }

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:640px">
      <h2 style="margin:0 0 4px">${matches.length} new match${matches.length === 1 ? "" : "es"}</h2>
      <p style="color:#666;margin:0 0 24px">Scored ${profile.scoreThreshold}+ in the last 24 hours.</p>
      ${matches
        .map(
          (j) => `
        <div style="border-left:3px solid #e4674a;padding:0 0 0 16px;margin:0 0 28px">
          <div style="font-size:13px;color:#888;letter-spacing:.04em;text-transform:uppercase">
            ${j.company} · ${j.score}/100
          </div>
          <div style="font-size:17px;font-weight:600;margin:4px 0">
            <a href="${j.url}" style="color:#111;text-decoration:none">${j.title}</a>
          </div>
          <div style="font-size:13px;color:#888;margin:0 0 10px">${j.location || "Location unspecified"}</div>
          <p style="margin:0 0 10px;line-height:1.5">${j.verdict ?? ""}</p>
          ${
            j.opener
              ? `<p style="margin:0;padding:12px;background:#f6f5f2;border-radius:6px;
                     font-style:italic;line-height:1.5">${j.opener}</p>`
              : ""
          }
        </div>`,
        )
        .join("")}
      <p style="font-size:12px;color:#999;border-top:1px solid #eee;padding-top:16px">
        Sent by the job agent running at ${profile.site}/agent
      </p>
    </div>`;

  await new Resend(apiKey).emails.send({
    from,
    to,
    subject: `${matches.length} new match${matches.length === 1 ? "" : "es"}, top score ${matches[0].score}`,
    html,
  });

  return NextResponse.json({ ok: true, matches: matches.length, sent: true });
}
