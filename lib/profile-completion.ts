import { calculateMacros, type ActivityLevel, type FitnessGoal } from "@/lib/nutrition-calculator"

// A "fitness_partners" row as far as completion logic cares. Extra columns are ignored.
export interface PartnerProfile {
  full_name?: string | null
  age?: number | null
  country?: string | null
  city?: string | null
  fitness_focus?: string | null // Primary Activity
  usual_gym_time?: string | null // Preferred Location
  gym_name?: string | null
  schedule_preference?: string | null // Workout Time
  weight_kg?: number | null
  height_cm?: number | null
  experience_level?: string | null
  goal?: string | null
  food_preference?: string | null
  body_fat_percentage?: number | null
}

// Required fields per spec (Instagram, Body Fat %, Trainer are optional).
// gym_name is conditionally required only when Preferred Location is "Gym".
const REQUIRED: { key: keyof PartnerProfile; label: string }[] = [
  { key: "full_name", label: "name" },
  { key: "age", label: "age" },
  { key: "country", label: "country" },
  { key: "city", label: "city" },
  { key: "fitness_focus", label: "primary activity" },
  { key: "usual_gym_time", label: "preferred location" },
  { key: "schedule_preference", label: "workout time" },
  { key: "weight_kg", label: "weight" },
  { key: "height_cm", label: "height" },
  { key: "experience_level", label: "experience" },
  { key: "goal", label: "goal" },
]

function isBlank(v: unknown): boolean {
  return v === null || v === undefined || (typeof v === "string" && v.trim() === "")
}

/** Labels of the required fields the user still needs to fill in. */
export function getMissingRequiredFields(p: PartnerProfile | null | undefined): string[] {
  if (!p) return REQUIRED.map((r) => r.label)
  const missing = REQUIRED.filter((r) => isBlank(p[r.key])).map((r) => r.label)
  // Gym name required only when location is a gym.
  if ((p.usual_gym_time || "").toLowerCase() === "gym" && isBlank(p.gym_name)) {
    missing.push("gym name")
  }
  return missing
}

/** True when every required field is present. */
export function isProfileComplete(p: PartnerProfile | null | undefined): boolean {
  return getMissingRequiredFields(p).length === 0
}

// Map the stored goal to the nutrition engine goal.
function toNutritionGoal(goal?: string | null): FitnessGoal {
  switch (goal) {
    case "Weight Loss":
      return "lose"
    case "Muscle Gain":
    case "Strength":
      return "gain"
    default:
      return "maintain"
  }
}

// Rough activity level from experience (no dedicated activity field yet).
function toActivityLevel(exp?: string | null): ActivityLevel {
  switch ((exp || "").toLowerCase()) {
    case "advanced":
      return "active"
    case "intermediate":
      return "moderate"
    case "beginner":
      return "light"
    default:
      return "moderate"
  }
}

/**
 * Build a COMPACT, low-token context line for TACLE AI. Nutrition is computed
 * deterministically on the client via the shared calculator so the model never
 * recomputes formulas or receives the full profile/food database.
 * Example: "72kg | 178cm | age26 | BF18 | Strength | Gym | beginner | Kerala Food | 2450kcal P160 C250 F70 | missing: city, workout time"
 */
export function buildAiProfileContext(p: PartnerProfile | null | undefined): string {
  if (!p) return ""
  const parts: string[] = []
  // First name so the assistant can address the user naturally.
  if (p.full_name) parts.push(`name ${p.full_name.trim().split(/\s+/)[0]}`)
  if (p.weight_kg) parts.push(`${p.weight_kg}kg`)
  if (p.height_cm) parts.push(`${p.height_cm}cm`)
  if (p.age) parts.push(`age${p.age}`)
  if (p.body_fat_percentage) parts.push(`BF${p.body_fat_percentage}`)
  if (p.goal) parts.push(p.goal)
  if (p.usual_gym_time) parts.push(p.usual_gym_time)
  if (p.experience_level) parts.push(p.experience_level)
  if (p.food_preference && p.food_preference !== "No Preference") parts.push(p.food_preference)
  if (p.city || p.country) parts.push([p.city, p.country].filter(Boolean).join("/"))

  // Deterministic macros when we have enough to compute them.
  if (p.weight_kg && p.height_cm && p.age) {
    const m = calculateMacros(
      Number(p.weight_kg),
      Number(p.height_cm),
      Number(p.age),
      "male", // gender not collected yet; keeps calc deterministic
      toActivityLevel(p.experience_level),
      toNutritionGoal(p.goal),
    )
    parts.push(`${m.targetCalories}kcal P${m.protein} C${m.carbs} F${m.fat}`)
  }

  const missing = getMissingRequiredFields(p)
  if (missing.length > 0) parts.push(`missing: ${missing.join(", ")}`)

  return parts.join(" | ")
}
