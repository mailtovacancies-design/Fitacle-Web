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

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
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
