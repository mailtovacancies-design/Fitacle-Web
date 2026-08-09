import type { MetadataRoute } from "next"

// Canonical production origin. The sitemap must resolve at
// https://www.fitacle.com/sitemap.xml, so every entry uses this www origin.
const BASE_URL = "https://www.fitacle.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Only public, indexable pages belong here.
  // Auth, API, and user/private routes are intentionally excluded.
  const routes: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
    priority: number
  }> = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/find-fitness-partner", changeFrequency: "daily", priority: 0.9 },
    { path: "/community", changeFrequency: "daily", priority: 0.8 },
    { path: "/help", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  ]

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
