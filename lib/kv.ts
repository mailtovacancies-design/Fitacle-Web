// Minimal REST helpers for the project's Upstash-compatible KV store.
// Used to remember each push subscription's IANA timezone (e.g. "Asia/Kolkata")
// without adding any new Postgres tables/columns.
const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

export function kvConfigured() {
  return Boolean(KV_URL && KV_TOKEN)
}

export async function kvSet(key: string, value: string): Promise<void> {
  if (!KV_URL || !KV_TOKEN) return
  try {
    await fetch(`${KV_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    })
  } catch {
    /* best-effort */
  }
}

export async function kvGet(key: string): Promise<string | null> {
  if (!KV_URL || !KV_TOKEN) return null
  try {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = await res.json()
    return typeof data?.result === "string" ? data.result : null
  } catch {
    return null
  }
}

export async function kvDel(key: string): Promise<void> {
  if (!KV_URL || !KV_TOKEN) return
  try {
    await fetch(`${KV_URL}/del/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    })
  } catch {
    /* best-effort */
  }
}
