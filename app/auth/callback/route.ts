import { createClient } from '@/lib/supabase/server'
import { isProfileComplete } from '@/lib/profile-completion'
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
      // A profile is "complete" only when every REQUIRED field is saved (not
      // merely when a row exists). Google sign-in users with missing details
      // are routed to the existing profile-completion experience.
      const { data: partner } = await supabase
        .from('fitness_partners')
        .select(
          'full_name, age, country, city, fitness_focus, usual_gym_time, gym_name, schedule_preference, weight_kg, height_cm, experience_level, goal',
        )
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (!isProfileComplete(partner)) {
        // Send to the existing Join the Network / profile completion section
        return NextResponse.redirect(`${origin}/#partner`)
      }

      // User has a complete profile, redirect to home
      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
