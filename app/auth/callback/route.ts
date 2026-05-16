import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')

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
