import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://projectfire.dev";

/**
 * Everything a signed-out crawler can actually read is fair game; the guarded
 * surfaces only ever redirect to /login, so keep them out of the crawl budget.
 * /portfolio stays crawlable — /portfolio/<id> is the site's most-shared URL.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/admin",
          "/club-leader",
          "/dashboard",
          "/tracker",
          "/calendar",
          "/login",
          "/signup",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
