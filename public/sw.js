/* Fitacle PWA service worker
 * Strategy:
 *  - Precache the offline fallback + core icons on install.
 *  - Navigations: network-first, fall back to cache, then the offline page.
 *  - Same-origin static assets (images/fonts/css/js): stale-while-revalidate.
 *  - API / auth / Supabase / cross-origin: always network (never cached) so
 *    user accounts, sessions, and data stay live and fresh.
 */
const VERSION = "fitacle-v2"
const STATIC_CACHE = `${VERSION}-static`
const RUNTIME_CACHE = `${VERSION}-runtime`
const OFFLINE_URL = "/offline.html"

const PRECACHE_URLS = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/images/fitacle-logo.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

// Never intercept these — keep them fully online so data/auth is always fresh.
function isBypassed(url, request) {
  if (request.method !== "GET") return true
  if (url.origin !== self.location.origin) return true // cross-origin (Supabase, gateway, analytics)
  if (url.pathname.startsWith("/api/")) return true
  if (url.pathname.startsWith("/auth/")) return true
  if (url.pathname.startsWith("/_next/data/")) return true
  return false
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (isBypassed(url, request)) return

  // App navigations: network-first with offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(async () => {
          const cached = await caches.match(request)
          return cached || caches.match(OFFLINE_URL)
        }),
    )
    return
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})

// Allow the page to trigger an immediate SW update.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting()
})
