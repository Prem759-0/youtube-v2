import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/trpc(.*)",
  "/api/videos/webhook(.*)",
  "/api/users/webhook(.*)",
  "/api/uploadthing(.*)",
  // workflows endpoints need to be public so they can be triggered by Upstash/QStash
  "/api/videos/workflows(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) { await auth.protect(); }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}