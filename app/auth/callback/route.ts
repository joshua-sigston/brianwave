/**
 * Auth Callback Route Handler
 * 
 * This route handles the callback from Supabase email confirmations and other auth flows.
 * When a user clicks a confirmation link in their email, Supabase redirects them here
 * with a code that we exchange for a session.
 */

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type') // 'recovery' for password reset

  if (code) {
    const supabase = createClient(cookies())
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if this is a password recovery flow
      if (type === 'recovery') {
        // Redirect to password change page for password reset
        return NextResponse.redirect(
          new URL('/auth/reset-password/change', requestUrl.origin)
        )
      }
      // Otherwise, it's email confirmation - redirect to login with success message
      return NextResponse.redirect(
        new URL('/auth/login?success=Email confirmed successfully. Please log in.', requestUrl.origin)
      )
    }
    
    // If code exchange failed, redirect with error
    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      )
    }
  }

  // If there's an error or no code, redirect to login page
  // Check if there's an actual error from Supabase
  const error = requestUrl.searchParams.get('error') || 
                requestUrl.searchParams.get('error_description')
  
  if (error) {
    // Only show error if there's an actual error from Supabase
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error)}`, requestUrl.origin)
    )
  }
  
  // Otherwise, just redirect to login page cleanly
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}
