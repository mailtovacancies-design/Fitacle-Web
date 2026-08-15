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
      // A profile is "complete" when the user has a fitness_partners row (the
      // profile form). Only users without one are routed to the completion flow;
      // users who already completed their profile go straight home.
      const { data: partner } = await supabase
        .from('fitness_partners')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (!partner) {
        // Redirect to Join the Network section to complete profile
        return NextResponse.redirect(`${origin}/#partner`)
      }

      // User has a complete profile, redirect to home
      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
