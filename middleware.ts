/**
 * Next.js Middleware
 * 
 * This middleware runs on every request matching the configured paths.
 * It handles Supabase session management, authentication state, and route protection.
 * 
 * The middleware intercepts requests before they reach your pages, allowing you to:
 * - Refresh authentication sessions automatically
 * - Protect routes that require authentication
 * - Redirect users based on their authentication state
 */

import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

/**
 * Main middleware function
 * 
 * This function is called by Next.js for every request that matches the matcher pattern.
 * It delegates session management and route protection to the updateSession utility.
 * 
 * @param request - The incoming Next.js request object
 * @returns A NextResponse with updated session cookies and any necessary redirects
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Middleware configuration
 * 
 * The matcher array defines which routes the middleware should run on.
 * This middleware runs on:
 * - All routes except static files, images, and favicon
 * - All /auth/* routes (for authentication pages)
 * - All /dashboard/* routes (for protected pages)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/auth/:path*',
    '/dashboard/:path*',
  ],
};
