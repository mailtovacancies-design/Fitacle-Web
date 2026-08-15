"use client"

import useSWR from "swr"

export interface SiteStats {
  users: number
  workoutsTracked: number
  satisfaction: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/**
 * Live homepage statistics from /api/stats.
 * Returns sensible fallbacks until the real numbers load so counters still animate.
 */
export function useStats(): SiteStats {
  const { data } = useSWR<SiteStats>("/api/stats", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  })

  return {
    users: data?.users ?? 0,
    workoutsTracked: data?.workoutsTracked ?? 0,
    satisfaction: data?.satisfaction ?? 93,
  }
}
