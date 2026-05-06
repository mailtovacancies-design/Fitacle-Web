import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Supabase URL available:", !!supabaseUrl)
  console.log("[v0] Supabase Key available:", !!supabaseAnonKey)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Missing Supabase env vars - client not created")
    return null
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
