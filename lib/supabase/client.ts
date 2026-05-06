import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] createClient - URL exists:", !!supabaseUrl)
  console.log("[v0] createClient - Key exists:", !!supabaseAnonKey)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Missing env vars, returning null")
    return null
  }

  console.log("[v0] Creating browser client...")
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
