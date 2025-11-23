/**
 * Server-side Supabase client utility
 * 
 * This file provides a function to create a Supabase client for use in
 * Next.js Server Components, Server Actions, and Route Handlers.
 * 
 * The client is configured to work with Next.js cookies, allowing it to
 * read and write authentication cookies for session management.
 * 
 * Usage:
 *   import { createClient } from '@/utils/supabase/server';
 *   import { cookies } from 'next/headers';
 * 
 *   const supabase = createClient(cookies());
 *   const { data } = await supabase.from('table').select();
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Load Supabase configuration from environment variables
// These are prefixed with NEXT_PUBLIC_ so they're available on both client and server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that required environment variables are present
// This prevents runtime errors and provides clear error messages during development
if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/**
 * Creates a Supabase client for server-side usage
 * 
 * @param cookieStore - The Next.js cookies() function result, which provides
 *                      access to the request's cookies. In Next.js 15+, this
 *                      is a promise that must be awaited.
 * @returns A configured Supabase client that can read/write cookies for auth
 * 
 * Note: The cookieStore parameter is typed as `ReturnType<typeof cookies>`
 * because in Next.js 15+, cookies() returns a promise, but in earlier versions
 * it returns the cookie store directly. This typing accommodates both.
 */
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      /**
       * Retrieves all cookies from the request
       * The cookieStore is awaited because in Next.js 15+ it's a promise
       */
      async getAll() {
        return (await cookieStore).getAll();
      },
      /**
       * Sets cookies on the response
       * 
       * This method is called by Supabase when it needs to update auth cookies
       * (e.g., after login, logout, or token refresh).
       * 
       * Important: In Server Components, you cannot set cookies directly.
       * If this is called from a Server Component, it will throw an error,
       * which we catch and ignore. This is safe because:
       * 1. Server Components are read-only
       * 2. Middleware handles session refresh automatically
       * 3. Server Actions and Route Handlers can set cookies properly
       * 
       * We use Promise.all to ensure all cookie operations complete before
       * the function returns, preventing race conditions.
       */
      async setAll(cookiesToSet) {
        try {
          // Resolve the cookie store (handles Next.js 15+ promise case)
          const resolvedCookieStore = await cookieStore;
          // Set all cookies in parallel for better performance
          await Promise.all(
            cookiesToSet.map(({ name, value, options }) =>
              resolvedCookieStore.set(name, value, options)
            )
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
