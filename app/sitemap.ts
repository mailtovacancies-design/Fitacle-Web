import type { MetadataRoute } from "next"
import { PARTNER_VARIANTS, SITE_ORIGIN } from "@/lib/partner-pages"

// Canonical production origin. The sitemap must resolve at
// https://www.fitacle.com/sitemap.xml, so every entry uses this www origin.
const BASE_URL = SITE_ORIGIN

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Only public, indexable pages belong here.
  // Auth, API, and user/private routes are intentionally excluded.
  const staticRoutes: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
    priority: number
  }> = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/community", changeFrequency: "daily", priority: 0.8 },
    { path: "/help", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  ]

  // All public SEO partner landing pages, kept in sync with the shared config.
  const partnerRoutes = PARTNER_VARIANTS.map((v) => ({
    path: `/${v.slug}`,
    changeFrequency: "daily" as const,
    priority: v.priority,
  }))

  return [...staticRoutes, ...partnerRoutes].map((route) => ({
    url: `${BASE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
