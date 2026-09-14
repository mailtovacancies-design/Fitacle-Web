import webpush from "web-push"

let configured = false

export function getVapidPublicKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ""
}

/**
 * Configure web-push with the VAPID keypair. Returns false when keys are
 * missing so callers can respond gracefully instead of throwing.
 */
export function configureWebPush() {
  if (configured) return true

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) return false

  const subject = process.env.VAPID_SUBJECT ?? "mailto:notifications@fitacle.app"
  webpush.setVapidDetails(subject, publicKey, privateKey)
  configured = true
  return true
}

/**
 * True when the VAPID keypair is present and web-push can be configured.
 */
export function isPushConfigured() {
  return configureWebPush()
}

type PushPayload = {
  title: string
  body: string
  url?: string
  tag?: string
}

type PushSubscriptionInput = {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

/**
 * Send a single push message. Returns { ok, stale } so the caller can prune
 * expired subscriptions (410 Gone / 404 Not Found) without throwing.
 */
export async function sendPushToSubscription(
  subscription: PushSubscriptionInput,
  payload: PushPayload,
): Promise<{ ok: boolean; stale: boolean }> {
  if (!configureWebPush()) return { ok: false, stale: false }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
    return { ok: true, stale: false }
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode
    const stale = statusCode === 404 || statusCode === 410
    return { ok: false, stale }
  }
}

export { webpush }
