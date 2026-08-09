// Central place for SEO-related site constants. Additive only — no UI/behavior impact.
// Override in production by setting NEXT_PUBLIC_SITE_URL to the canonical domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fitacle.vercel.app"
).replace(/\/$/, "")

export const SITE_NAME = "Fitacle"

// Natural-language search terms Fitacle should be discoverable for. Used in
// keyword metadata only (not rendered as visible content).
export const FITNESS_PARTNER_KEYWORDS = [
  "find a fitness partner",
  "fitness partner near me",
  "find fitness partner near me",
  "find a workout partner",
  "workout partner near me",
  "gym partner near me",
  "find a gym partner",
  "gym buddy near me",
  "workout buddy near me",
  "running partner near me",
  "running buddy near me",
  "walking partner near me",
  "training partner near me",
  "fitness companion",
  "fitness companion near me",
  "looking for a fitness partner",
  "looking for a workout partner",
  "someone to workout with",
  "exercise partner near me",
  "training buddy near me",
]
