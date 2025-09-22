import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/register(.*)',
  '/get-started',
  '/api/ping',
  '/api/test-gemini',
  '/api/esp32/vitals',
  '/api/webhooks/clerk',
  '/api/notifications/email',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isDoctorRoute = createRouteMatcher(['/doctor(.*)'])
const isPatientRoute = createRouteMatcher(['/patient(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return
  }

  // Protect all other routes
  const { userId, sessionClaims } = await auth()
  
  if (!userId) {
    return Response.redirect(new URL('/login', req.url))
  }

  const userRole = sessionClaims?.publicMetadata?.role as string

  // Role-based route protection
  if (isAdminRoute(req) && userRole !== 'admin') {
    return Response.redirect(new URL('/get-started', req.url))
  }

  if (isDoctorRoute(req) && userRole !== 'doctor') {
    return Response.redirect(new URL('/get-started', req.url))
  }

  if (isPatientRoute(req) && userRole !== 'patient') {
    return Response.redirect(new URL('/get-started', req.url))
  }

  // Redirect users without roles to get-started
  if (!userRole && req.nextUrl.pathname !== '/get-started') {
    return Response.redirect(new URL('/get-started', req.url))
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}