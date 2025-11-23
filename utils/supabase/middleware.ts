/**
 * Middleware Supabase client utility
 * 
 * This file provides a function to create a Supabase client for use in
 * Next.js Middleware. Middleware runs on the edge before requests reach
 * your route handlers, making it perfect for:
 * - Authentication checks
 * - Session refresh
 * - Route protection
 * - Redirecting unauthenticated users
 * 
 * Usage in middleware.ts:
 *   import { createClient } from '@/utils/supabase/middleware';
 *   import { NextResponse } from 'next/server';
 * 
 *   export async function middleware(request: NextRequest) {
 *     const { supabase, response } = createClient(request);
 *     const { data: { user } } = await supabase.auth.getUser();
 * 
 *     if (!user) {
 *       return NextResponse.redirect(new URL('/login', request.url));
 *     }
 * 
 *     return response;
 *   }
 */

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Load Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that required environment variables are present
if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/**
 * Creates a Supabase client for Next.js Middleware usage
 * 
 * This function:
 * - Creates a Supabase client that can read cookies from the incoming request
 * - Sets up cookie handling to write auth cookies to the response
 * - Returns both the Supabase client and the response object
 * 
 * @param request - The incoming Next.js request object
 * @returns An object containing:
 *   - supabase: The Supabase client for auth checks and data access
 *   - response: The NextResponse object with updated cookies
 * 
 * Important: You must return the response object from your middleware
 * for cookie updates to take effect. The response is created fresh each
 * time cookies are set to ensure proper cookie handling.
 */
export const updateSession = (request: NextRequest) => {
  // Initialize the response object
  // This will be updated whenever Supabase needs to set cookies
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create the Supabase client with cookie handlers
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      /**
       * Reads cookies from the incoming request
       * Middleware has direct access to request.cookies
       */
      getAll() {
        return request.cookies.getAll();
      },
      /**
       * Writes cookies to the response
       * 
       * When Supabase needs to update auth cookies (e.g., refresh token),
       * it calls this method. We create a fresh NextResponse and set
       * all the cookies on it. This ensures cookies are properly
       * serialized and sent to the client.
       * 
       * Note: We recreate the response each time to ensure cookie updates
       * are properly applied, as Next.js response objects are immutable.
       */
      setAll(cookiesToSet) {
        // Create a new response with the current request
        supabaseResponse = NextResponse.next({
          request,
        });
        // Set all cookies on the response
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Return both the client and response
  // The client is used for auth checks, the response must be returned
  return { supabase, response: supabaseResponse };
};
