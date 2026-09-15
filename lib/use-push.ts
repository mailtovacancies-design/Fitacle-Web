"use client"

import { useCallback, useEffect, useState } from "react"

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

type PushState = {
  supported: boolean
  permission: NotificationPermission | "unsupported"
  subscribed: boolean
  loading: boolean
}

export function usePush() {
  const [state, setState] = useState<PushState>({
    supported: false,
    permission: "unsupported",
    subscribed: false,
    loading: true,
  })

  useEffect(() => {
    let cancelled = false

    async function init() {
      const supported =
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window

      if (!supported) {
        if (!cancelled) {
          setState({ supported: false, permission: "unsupported", subscribed: false, loading: false })
        }
        return
      }

      let subscribed = false
      try {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()
        subscribed = Boolean(sub)
      } catch {
        subscribed = false
      }

      if (!cancelled) {
        setState({
          supported: true,
          permission: Notification.permission,
          subscribed,
          loading: false,
        })
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  const subscribe = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    try {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        console.log("[v0] Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY")
        setState((s) => ({ ...s, loading: false }))
        return { ok: false, error: "Push not configured" }
      }

      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setState((s) => ({ ...s, permission, loading: false }))
        return { ok: false, error: "Permission not granted" }
      }

      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      const sub =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        }))

      // Include the browser's IANA timezone so daily notifications can be
      // scheduled at 8am/6pm in each user's own local time.
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sub.toJSON(), timezone }),
      })

      if (!res.ok) {
        setState((s) => ({ ...s, permission, loading: false }))
        return { ok: false, error: "Failed to save subscription" }
      }

      setState((s) => ({ ...s, permission, subscribed: true, loading: false }))
      return { ok: true }
    } catch (err) {
      console.log("[v0] Push subscribe error:", (err as Error).message)
      setState((s) => ({ ...s, loading: false }))
      return { ok: false, error: (err as Error).message }
    }
  }, [])

  const unsubscribe = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setState((s) => ({ ...s, subscribed: false, loading: false }))
      return { ok: true }
    } catch (err) {
      console.log("[v0] Push unsubscribe error:", (err as Error).message)
      setState((s) => ({ ...s, loading: false }))
      return { ok: false, error: (err as Error).message }
    }
  }, [])

  return { ...state, subscribe, unsubscribe }
}

/**
 * Best-effort, silent re-registration of push for users who already granted
 * browser notification permission in the past (e.g. before the timezone
 * field existed, or before their device's push subscription was ever
 * persisted). Never prompts — only runs when permission is already
 * "granted" — so it's safe to call on every app load.
 */
export async function silentPushResync(): Promise<void> {
  try {
    if (typeof window === "undefined") return
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
    if (!supported || Notification.permission !== "granted") return

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidPublicKey) return

    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from("profiles")
      .select("notifications_enabled")
      .eq("id", user.id)
      .maybeSingle()
    if (profile?.notifications_enabled === false) return

    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    const sub =
      existing ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      }))

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sub.toJSON(), timezone }),
    })
  } catch (err) {
    console.log("[v0] silentPushResync error:", (err as Error).message)
  }
}
