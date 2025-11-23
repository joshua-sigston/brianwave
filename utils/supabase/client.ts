/**
 * Client-side Supabase client utility
 * 
 * This file provides a function to create a Supabase client for use in
 * Client Components, React hooks, and browser-side code.
 * 
 * The client automatically handles cookies using the browser's cookie storage,
 * making it ideal for client-side authentication and data fetching.
 * 
 * Usage:
 *   'use client';
 *   import { createClient } from '@/utils/supabase/client';
 * 
 *   const supabase = createClient();
 *   const { data } = await supabase.from('table').select();
 */

import { createBrowserClient } from "@supabase/ssr";

// Load Supabase configuration from environment variables
// NEXT_PUBLIC_ prefix makes these available in the browser
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
 * Creates a Supabase client for client-side (browser) usage
 * 
 * This client:
 * - Automatically reads/writes cookies from the browser
 * - Works seamlessly with React hooks and Client Components
 * - Handles authentication state changes in real-time
 * 
 * @returns A configured Supabase client ready for browser use
 * 
 * Note: This should only be used in Client Components (files with 'use client')
 * or in browser-side code. For server-side code, use the server.ts utility instead.
 */
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseKey);
};
