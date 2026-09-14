import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

  const subscription = body?.subscription
  const endpoint: string | undefined = subscription?.endpoint
  const p256dh: string | undefined = subscription?.keys?.p256dh
  const auth: string | undefined = subscription?.keys?.auth

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
  const query = supabase.from("push_subscriptions").delete().eq("user_id", user.id)

  const { error } = endpoint ? await query.eq("endpoint", endpoint) : await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
