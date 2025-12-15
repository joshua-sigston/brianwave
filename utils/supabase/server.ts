/**
 * Server-side Supabase client factory
 * 
 * This module creates a Supabase client for use in Server Components,
 * Server Actions, and other server-side code. It uses Next.js cookies()
 * to read and write authentication session cookies.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Get Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that required environment variables are set
if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
  }
  
  if (!supabaseKey) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

/**
 * Creates a Supabase client for server-side use
 * 
 * This client is designed for use in Server Components and Server Actions.
 * It uses Next.js cookies() to manage authentication sessions on the server.
 * 
 * @param cookieStore - The Next.js cookies() store from next/headers
 * @returns A configured Supabase client instance with server-side cookie handling
 */
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        // Read all cookies from the Next.js cookie store
        // This allows the server to access the current session
        async getAll() {
          return (await cookieStore).getAll()
        },
        // Write cookies to the Next.js cookie store
        // This persists session updates on the server
        async setAll(cookiesToSet) {
          try {
            // Set each cookie in the store
            cookiesToSet.forEach(async ({ name, value, options }) => (await cookieStore).set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
