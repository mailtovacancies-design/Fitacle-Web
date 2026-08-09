import type { MetadataRoute } from "next"

const BASE_URL = "https://www.fitacle.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep auth, API, and private/user surfaces out of the index.
        disallow: ["/auth/", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
