import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const tokenHash = searchParams.get('token_hash')

  // Recovery links must land on the reset-password screen, not be silently
  // exchanged into a normal session and sent home. Forward them along with
  // whatever tokens Supabase provided so the reset page can complete the flow.
  if (type === 'recovery' || (tokenHash && type)) {
    const target = new URL(`${origin}/auth/reset-password`)
    searchParams.forEach((value, key) => target.searchParams.set(key, value))
    return NextResponse.redirect(target)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if user has incomplete profile data
      const metadata = data.user.user_metadata || {}
      const hasCompleteProfile = metadata.weight && metadata.height && metadata.age && metadata.fitness_goal
      
      if (!hasCompleteProfile) {
        // Redirect to Join the Network section to complete profile
        return NextResponse.redirect(`${origin}/#partner`)
      }
      
      // User has complete profile, redirect to home
      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
