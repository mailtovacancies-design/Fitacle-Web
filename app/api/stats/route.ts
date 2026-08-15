import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Homepage statistics derived from the real registered-user count.
//   Users            = actual registered users
//   Workouts Tracked = registered users + 100
//   Satisfaction     = fixed at 93%
// Uses the service-role key so the count bypasses RLS (read-only, server-only).

export const dynamic = "force-dynamic"

const SATISFACTION = 93

export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  let users = 0
  try {
    if (url && serviceKey) {
      const supabase = createClient(url, serviceKey, {
        auth: { persistSession: false },
      })
      // Count rows in profiles (one row per registered user).
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
      if (!error && typeof count === "number") {
        users = count
      }
    }
  } catch {
    // Fall back to zero registered users on any failure.
  }

  const payload = {
    users,
    workoutsTracked: users + 100,
    satisfaction: SATISFACTION,
  }

  return NextResponse.json(payload, {
    // Cache briefly at the edge to keep the homepage fast.
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  })
}
