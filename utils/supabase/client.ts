/**
 * Client-side Supabase client factory
 * 
 * This module creates a Supabase client for use in Client Components,
 * React Server Components with 'use client', and other browser-side code.
 * The client automatically handles cookie-based session management in the browser.
 */

import { createBrowserClient } from "@supabase/ssr";

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
 * Creates a Supabase client for browser/client-side use
 * 
 * This client is designed for use in Client Components and browser contexts.
 * It automatically reads and writes cookies to manage authentication sessions.
 * 
 * @returns A configured Supabase client instance
 */
export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );
