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

export { webpush }
