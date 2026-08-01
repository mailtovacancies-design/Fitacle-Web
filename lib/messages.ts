import { createClient } from "@/lib/supabase/client"

export interface DirectMessage {
  id: string
  sender_id: string
  recipient_id: string
  body: string
  created_at: string
  read_at: string | null
}

export interface Conversation {
  otherId: string
  name: string
  initial: string
  lastBody: string
  lastAt: string
  lastFromMe: boolean
  unread: number
}

/** Returns the currently signed-in user's id, or null. */
export async function fetchCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

/** All messages exchanged between the current user and `otherId`, oldest first. */
export async function fetchThread(me: string, otherId: string): Promise<DirectMessage[]> {
  const supabase = createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from("direct_messages")
    .select("id, sender_id, recipient_id, body, created_at, read_at")
    .or(
      `and(sender_id.eq.${me},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${me})`,
    )
    .order("created_at", { ascending: true })
  if (error) throw error
  return (data as DirectMessage[]) ?? []
}

/** Send a message from the current user to `recipientId`. */
export async function sendMessage(recipientId: string, body: string): Promise<void> {
  const trimmed = body.trim()
  if (!trimmed) throw new Error("Message cannot be empty.")
  const supabase = createClient()
  if (!supabase) throw new Error("Messaging is not available right now.")
  const { data: userData } = await supabase.auth.getUser()
  const me = userData.user?.id
  if (!me) throw new Error("Please sign in to send a message.")
  if (me === recipientId) throw new Error("You cannot message yourself.")
  const { error } = await supabase
    .from("direct_messages")
    .insert({ sender_id: me, recipient_id: recipientId, body: trimmed.slice(0, 2000) })
  if (error) throw error
}

/** Mark all messages received from `otherId` as read. */
export async function markThreadRead(otherId: string): Promise<void> {
  const supabase = createClient()
  if (!supabase) return
  const { data: userData } = await supabase.auth.getUser()
  const me = userData.user?.id
  if (!me) return
  await supabase
    .from("direct_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", me)
    .eq("sender_id", otherId)
    .is("read_at", null)
}

/** Build the current user's conversation list (grouped by the other party). */
export async function fetchInbox(me: string): Promise<Conversation[]> {
  const supabase = createClient()
  if (!supabase) return []
  const { data: msgs, error } = await supabase
    .from("direct_messages")
    .select("id, sender_id, recipient_id, body, created_at, read_at")
    .or(`sender_id.eq.${me},recipient_id.eq.${me}`)
    .order("created_at", { ascending: false })
  if (error) throw error

  const map = new Map<string, Conversation>()
  for (const m of (msgs as DirectMessage[]) ?? []) {
    const otherId = m.sender_id === me ? m.recipient_id : m.sender_id
    if (!map.has(otherId)) {
      map.set(otherId, {
        otherId,
        name: "Fitacle member",
        initial: "F",
        lastBody: m.body,
        lastAt: m.created_at,
        lastFromMe: m.sender_id === me,
        unread: 0,
      })
    }
    const conv = map.get(otherId)!
    if (m.recipient_id === me && !m.read_at) conv.unread++
  }

  const ids = [...map.keys()]
  if (ids.length) {
    const { data: partners } = await supabase
      .from("fitness_partners")
      .select("user_id, full_name, avatar_initial")
      .in("user_id", ids)
    for (const p of (partners as { user_id: string; full_name: string; avatar_initial: string | null }[]) ?? []) {
      const conv = map.get(p.user_id)
      if (conv) {
        conv.name = p.full_name || conv.name
        conv.initial = (p.avatar_initial || p.full_name?.charAt(0) || "F").toUpperCase()
      }
    }
  }

  return [...map.values()].sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1))
}

export interface AppNotification {
  id: string
  type: string
  title: string
  body: string | null
  ref_id: string | null
  is_read: boolean
  created_at: string
}

/** Latest notifications for the current user (newest first). */
export async function fetchNotifications(limit = 20): Promise<AppNotification[]> {
  const supabase = createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, ref_id, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as AppNotification[]) ?? []
}

/** Mark a single notification as read. */
export async function markNotificationRead(id: string): Promise<void> {
  const supabase = createClient()
  if (!supabase) return
  await supabase.from("notifications").update({ is_read: true }).eq("id", id)
}

/** Mark all of the current user's notifications as read. */
export async function markAllNotificationsRead(): Promise<void> {
  const supabase = createClient()
  if (!supabase) return
  const { data: userData } = await supabase.auth.getUser()
  const me = userData.user?.id
  if (!me) return
  await supabase.from("notifications").update({ is_read: true }).eq("user_id", me).eq("is_read", false)
}

/** Look up a partner's display name + initial by their user_id (for opening a thread from a notification). */
export async function fetchPartnerByUserId(
  userId: string,
): Promise<{ userId: string; name: string; initial: string } | null> {
  const supabase = createClient()
  if (!supabase) return null
  const { data } = await supabase
    .from("fitness_partners")
    .select("user_id, full_name, avatar_initial")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle()
  if (!data) return { userId, name: "Fitacle member", initial: "F" }
  const p = data as { user_id: string; full_name: string; avatar_initial: string | null }
  return {
    userId,
    name: p.full_name || "Fitacle member",
    initial: (p.avatar_initial || p.full_name?.charAt(0) || "F").toUpperCase(),
  }
}
