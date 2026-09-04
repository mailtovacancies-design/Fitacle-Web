import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Canonical domain enforcement: permanently redirect the bare apex host
  // (fitacle.com) to the preferred www host so Google sees a single canonical
  // URL. Only fires for the exact non-www production host, so preview
  // deployments, localhost and all other hosts are untouched.
  const host = request.headers.get('host')
  if (host === 'fitacle.com') {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.host = 'www.fitacle.com'
    return NextResponse.redirect(url, 308)
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
