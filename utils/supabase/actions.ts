/**
 * Server Actions and Route Handlers Supabase client utility
 * 
 * This file provides a function to create a Supabase client specifically
 * optimized for use in Next.js Server Actions and Route Handlers.
 * 
 * Unlike the server.ts utility, this client uses the new writeable cookie API,
 * which allows direct cookie writes. This makes it ideal for:
 * - Server Actions (form submissions, mutations)
 * - Route Handlers (API endpoints)
 * - Any server-side context where you need to write cookies
 * 
 * Usage in Server Actions:
 *   'use server';
 *   import { createActionClient } from '@/utils/supabase/actions';
 * 
 *   export async function myAction() {
 *     const supabase = await createActionClient();
 *     const { data } = await supabase.from('table').select();
 *     // Cookies can be written here
 *   }
 * 
 * Usage in Route Handlers:
 *   import { createActionClient } from '@/utils/supabase/actions';
 * 
 *   export async function GET(request: Request) {
 *     const supabase = await createActionClient();
 *     const { data } = await supabase.from('table').select();
 *     return Response.json(data);
 *   }
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Load Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that required environment variables are present
// This prevents runtime errors and provides clear error messages
if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/**
 * Creates a Supabase client for Server Actions and Route Handlers
 * 
 * This function:
 * - Awaits the cookies() function to get a writeable cookie store
 * - Uses the new cookie API format that supports direct writes
 * - Returns a client that can read and write authentication cookies
 * 
 * Key differences from server.ts:
 * - This function is async and handles cookies() internally
 * - Uses the new API format: getAll() returns { name, value } objects
 * - Cookie writes are direct (no try/catch needed) because Server Actions
 *   and Route Handlers always have write access
 * 
 * @returns A Promise that resolves to a configured Supabase client
 * 
 * Note: This should only be used in Server Actions and Route Handlers.
 * For Server Components, use the server.ts utility instead.
 */
export async function createActionClient() {
  // In Server Actions and Route Handlers, cookies() returns a writeable store
  // We await it here because in Next.js 15+ it returns a promise
  const cookieStore = await cookies();

  return createServerClient(
    // Type assertions are safe here because we validated the env vars above
    supabaseUrl as string,
    supabaseKey as string,
    {
      cookies: {
        /**
         * Retrieves all cookies from the request
         * 
         * The new API format returns only { name, value } objects,
         * which is sufficient for Supabase's cookie handling.
         * This is different from the server.ts utility which returns
         * full cookie objects with options.
         */
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        /**
         * Sets cookies on the response
         * 
         * This method is called by Supabase when it needs to update
         * authentication cookies (e.g., after login, logout, token refresh).
         * 
         * Unlike server.ts, we don't need try/catch here because:
         * - Server Actions and Route Handlers always have write access
         * - The cookieStore.set() method will always succeed in these contexts
         * 
         * Each cookie is set with its name, value, and options (like
         * httpOnly, secure, sameSite, etc.) which are provided by Supabase.
         */
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            // Directly writes Set-Cookie headers to the response
            // This works because we're in a writeable context
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}