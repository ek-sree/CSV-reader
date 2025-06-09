import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// ✅ Mark routes public (no auth needed)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/csv-manager(.*)', // ✅ allow access for everyone
])

export default clerkMiddleware(async(auth, req) => {
  const { userId } = await auth()

  // ✅ If not signed in and trying to access a protected route → redirect to /csv-manager
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/csv-manager', req.url))
  }

  // ✅ All good — proceed
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)', // match everything except assets/_next
  ],
}
