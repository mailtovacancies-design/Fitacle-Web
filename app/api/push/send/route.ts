import { createClient } from "@supabase/supabase-js"
import { sendPushToSubscription, isPushConfigured } from "@/lib/push"

export const dynamic = "force-dynamic"

type TimeOfDay = "morning" | "evening"

function firstNameFrom(fullName: string | null): string {
  if (!fullName) return "there"
  const trimmed = fullName.trim()
  if (!trimmed) return "there"
  return trimmed.split(/\s+/)[0]
}

function buildMessage(timeOfDay: TimeOfDay, firstName: string) {
  if (timeOfDay === "morning") {
    return {
      title: "Good morning 👋",
      body: `Good morning, ${firstName} 👋 Check Fitacle for your personalised recommendations and plan your day.`,
    }
  }
  return {
    title: "Good evening 🌙",
    body: `Good evening, ${firstName} 🌙 Have you achieved your goals today? Check Fitacle, log your activity and see your AI recommendations.`,
  }
}

function resolveTimeOfDay(param: string | null): TimeOfDay {
  if (param === "morning" || param === "evening") return param
  // Fallback: decide by server hour (before 15:00 UTC => morning)
  const hour = new Date().getUTCHours()
  return hour < 15 ? "morning" : "evening"
}

export async function GET(request: Request) {
  // Authorize cron/manual calls with CRON_SECRET
  const authHeader = request.headers.get("authorization")
  const url = new URL(request.url)
  const secret = process.env.CRON_SECRET

  if (secret) {
    const bearerOk = authHeader === `Bearer ${secret}`
    const queryOk = url.searchParams.get("secret") === secret
    if (!bearerOk && !queryOk) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  if (!isPushConfigured()) {
    return Response.json(
      { error: "Push not configured. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY." },
      { status: 500 },
    )
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return Response.json({ error: "Server not configured." }, { status: 500 })
  }

  const timeOfDay = resolveTimeOfDay(url.searchParams.get("timeOfDay"))

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Only users who have notifications enabled
  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, full_name, notifications_enabled")
    .eq("notifications_enabled", true)

  if (profilesError) {
    return Response.json({ error: profilesError.message }, { status: 500 })
  }

  const enabledIds = (profiles ?? []).map((p) => p.id)
  if (enabledIds.length === 0) {
    return Response.json({ sent: 0, message: "No users with notifications enabled." })
  }

  const nameById = new Map<string, string | null>(
    (profiles ?? []).map((p) => [p.id as string, (p.full_name as string | null) ?? null]),
  )

  const { data: subs, error: subsError } = await admin
    .from("push_subscriptions")
    .select("user_id, endpoint, p256dh, auth")
    .in("user_id", enabledIds)

  if (subsError) {
    return Response.json({ error: subsError.message }, { status: 500 })
  }

  let sent = 0
  let failed = 0
  const staleEndpoints: string[] = []

  await Promise.all(
    (subs ?? []).map(async (sub) => {
      const firstName = firstNameFrom(nameById.get(sub.user_id as string) ?? null)
      const message = buildMessage(timeOfDay, firstName)
      const result = await sendPushToSubscription(
        {
          endpoint: sub.endpoint as string,
          keys: { p256dh: sub.p256dh as string, auth: sub.auth as string },
        },
        {
          title: message.title,
          body: message.body,
          url: "/",
          tag: `fitacle-${timeOfDay}`,
        },
      )
      if (result.ok) {
        sent += 1
      } else {
        failed += 1
        if (result.stale) staleEndpoints.push(sub.endpoint as string)
      }
    }),
  )

  // Clean up expired/invalid subscriptions
  if (staleEndpoints.length > 0) {
    await admin.from("push_subscriptions").delete().in("endpoint", staleEndpoints)
  }

  return Response.json({ sent, failed, timeOfDay, cleaned: staleEndpoints.length })
}
