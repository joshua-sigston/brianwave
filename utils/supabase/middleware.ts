/**
 * Middleware utility for Supabase session management
 * 
 * This module provides session update functionality for Next.js middleware.
 * It handles authentication state, cookie management, and route protection.
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Updates the Supabase session and handles route protection
 * 
 * This function:
 * - Creates a Supabase client with middleware cookie handling
 * - Refreshes the user session if needed
 * - Redirects authenticated users away from auth pages
 * - Protects dashboard routes from unauthenticated access
 * 
 * @param request - The incoming Next.js request object
 * @returns A NextResponse with updated session cookies and any necessary redirects
 */
export async function updateSession(request: NextRequest) {
  // Create an initial response that will be modified as cookies are set
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a Supabase client configured for middleware context
  // This client can read from request cookies and write to response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read all cookies from the incoming request
        // This allows Supabase to access the current session
        getAll() {
          return request.cookies.getAll();
        },
        // Write cookies to both request and response
        // This ensures session updates are persisted in the response
        setAll(cookiesToSet) {
          // Update the request cookies (for current request processing)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Recreate the response with the updated request
          supabaseResponse = NextResponse.next({
            request,
          });
          // Set cookies on the response (so they're sent back to the client)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current user from the session
  // This call also refreshes the session if it's expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the current path should be excluded from auth redirect logic
  const pathname = request.nextUrl.pathname
  const isCallbackRoute = pathname === '/auth/callback'
  const isNewPasswordPage = pathname === '/auth/new-password'
  const isResetPasswordChangePage = pathname === '/auth/reset-password/change'

  // Redirect authenticated users away from auth pages
  // Prevents logged-in users from seeing login/signup forms
  // Exception: allow access to callback, new password, and reset password change pages
  if (
    user &&
    request.nextUrl.pathname.startsWith('/auth') &&
    !isCallbackRoute &&
    !isNewPasswordPage &&
    !isResetPasswordChangePage
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect dashboard routes: redirect unauthenticated users to login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Return the response with updated session cookies
  return supabaseResponse;
}
