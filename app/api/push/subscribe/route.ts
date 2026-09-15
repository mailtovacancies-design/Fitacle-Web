import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { kvSet, kvDel } from "@/lib/kv"

function timezoneKey(endpoint: string) {
  return `push_tz:${endpoint}`
}

// Store (or remove) the caller's push subscription. RLS scopes rows to the user.
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  // The client posts the raw PushSubscription JSON (endpoint + keys at top level).
  const subscription = body?.subscription ?? body
  const endpoint: string | undefined = subscription?.endpoint
  const p256dh: string | undefined = subscription?.keys?.p256dh
  const auth: string | undefined = subscription?.keys?.auth
  // IANA timezone (e.g. "Asia/Kolkata"), captured client-side, so daily
  // notifications can be sent at 8am/6pm in each user's own local time.
  const timezone: string | undefined = typeof subscription?.timezone === "string" ? subscription.timezone : undefined

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint,
      p256dh,
      auth,
    },
    { onConflict: "endpoint" },
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Stored in KV (not Postgres) to avoid any schema change to push_subscriptions.
  if (timezone) {
    await kvSet(timezoneKey(endpoint), timezone)
  }

  return NextResponse.json({ ok: true })
}

// Remove a subscription (e.g. when the user turns notifications off).
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const endpoint: string | undefined = body?.endpoint

  // Look up which endpoints will be removed first, so their KV timezone
  // entries can be cleaned up too (KV has no cascading delete).
  const lookup = supabase.from("push_subscriptions").select("endpoint").eq("user_id", user.id)
  const { data: toRemove } = endpoint ? await lookup.eq("endpoint", endpoint) : await lookup

  const query = supabase.from("push_subscriptions").delete().eq("user_id", user.id)
  const { error } = endpoint ? await query.eq("endpoint", endpoint) : await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await Promise.all((toRemove ?? []).map((row) => kvDel(timezoneKey(row.endpoint as string))))

  return NextResponse.json({ ok: true })
}
