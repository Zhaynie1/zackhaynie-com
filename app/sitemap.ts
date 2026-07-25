import type { MetadataRoute } from "next";
import { profile } from "@/lib/profile";

/**
 * The list of pages we want Google to index. Two, for now: the home page and
 * the agent's full results. Submitting this in Search Console is what gets the
 * site crawled in the first place; without it, "verified" still means invisible.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.site;
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/agent`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
