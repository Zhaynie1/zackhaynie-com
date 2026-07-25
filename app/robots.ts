import type { MetadataRoute } from "next";
import { profile } from "@/lib/profile";

/**
 * Let every crawler read everything, and point them at the sitemap. There is
 * nothing private on this site to wall off.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${profile.site}/sitemap.xml`,
    host: profile.site,
  };
}
