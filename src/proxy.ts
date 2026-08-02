import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 1. Initialize Supabase using your correct modern Publishable Key
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // <-- Modern Key Variable Used!
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 2. Refresh the session cookie in the background automatically
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Define the routing paths for RFQPilot
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  // 4. Enforce RFQPilot Security Guards
  
  // If user is logged in, do not let them go back to the login page
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is NOT logged in and tries to access the secure factory workspace, kick them out
  if (!user && isDashboardPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // NOTE: Public routes like /respond/[token] bypass these conditions entirely
  return supabaseResponse
}

// 5. Filter out static design assets so middleware only runs on valid routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}