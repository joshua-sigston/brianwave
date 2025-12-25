"use server"

import { getOrigin } from "@/lib/auth-utils"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Server action for user signup/registration
 * 
 * Handles new user account creation with email and password authentication.
 * After successful signup, Supabase sends a confirmation email to the user.
 * 
 * @param formData - Form data containing email and password fields
 * @returns Redirects to sign-up page with success/error message
 */
export async function signup(formData: FormData) {
    // Create Supabase client with server-side cookie handling
    const supabase = createClient(cookies())
    
    // Extract email and password from form data
    const email = formData.get("email")?.toString()
    const password = formData.get("password")?.toString()

    // Validate that both email and password are provided
    if (!email || !password) {
        redirect(`/auth/sign-up?error=${encodeURIComponent("Email and password are required")}`)
    }

    // Get the origin URL for email redirect callback
    const origin = await getOrigin()

    // Attempt to create the user account via Supabase Auth
    // emailRedirectTo specifies where user will be redirected after email confirmation
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`
        }
    })

    // If there's an error (e.g., email already exists, weak password), redirect with error message
    if (error) {
        redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`)
    }

    // Redirect to signup page with success message
    // User needs to confirm email before accessing dashboard
    redirect(`/auth/sign-up?success=${encodeURIComponent("Account created successfully! Please check your email to confirm your account.")}`)
}

/**
 * Server action for user login/authentication
 * 
 * Authenticates an existing user with their email and password.
 * On success, creates a session and redirects to the dashboard.
 * 
 * @param formData - Form data containing email and password fields
 * @returns Redirects to dashboard on success, or login page with error message on failure
 */
export async function login(formData: FormData) {
    // Create Supabase client with server-side cookie handling
    const supabase = createClient(cookies())
    
    // Extract email and password from form data
    const email = formData.get("email")?.toString()
    const password = formData.get("password")?.toString()

    // Validate that both email and password are provided
    if (!email || !password) {
        redirect(`/auth/login?error=${encodeURIComponent("Email and password are required")}`)
    }

    // Attempt to sign in with email and password
    // This creates a session if credentials are valid
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    // If authentication fails (wrong credentials, unconfirmed email, etc.), redirect with error
    if (error) {
        redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
    }

    // Success! Redirect to dashboard
    redirect("/dashboard")
}

/**
 * Server action for user logout
 * 
 * Ends the current user session and clears authentication cookies.
 * After logout, user is redirected to the login page.
 * 
 * @returns Redirects to login page after signing out
 */
export async function logout() {
    // Create Supabase client with server-side cookie handling
    const supabase = createClient(cookies())

    // Sign out the current user and clear session
    await supabase.auth.signOut()
    
    // Redirect to login page
    redirect("/auth/login")
}

/**
 * Server action for requesting a password reset
 * 
 * Sends a password reset email to the user if an account exists with the provided email.
 * For security reasons, always shows a success message regardless of whether the email exists.
 * 
 * @param formData - Form data containing email field
 * @returns Redirects to password reset request page with success/error message
 */
export async function requestPasswordReset(formData: FormData) {
    // Create Supabase client with server-side cookie handling
    const supabase = createClient(cookies())
    
    // Extract email from form data
    const email = formData.get("email")?.toString()

    // Validate that email is provided
    if (!email) {
        redirect(`/auth/reset-password/request?error=${encodeURIComponent("Email is required")}`)
    }

    // Get the origin URL for password reset redirect
    const origin = await getOrigin()

    // Use Supabase Auth to send password reset email
    // This checks against Authentication users, not database tables
    // resetPasswordForEmail will only send email if account exists (but we don't reveal this)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password/change`,
    })

    // If there's an error, redirect with error message
    if (error) {
        redirect(`/auth/reset-password/request?error=${encodeURIComponent(error.message)}`)
    }

    // Always redirect with success message (for security, don't reveal if email exists)
    // This prevents email enumeration attacks
    redirect(`/auth/reset-password/request?success=If an account exists with this email, a password reset link has been sent.`)
}

/**
 * Server action for setting a new password after password reset
 * 
 * Updates the user's password after they've clicked the reset link in their email.
 * Requires the user to be authenticated via the password reset token from the email link.
 * 
 * @param formData - Form data containing password field
 * @returns Redirects to login page on success, or change password page with error on failure
 */
export async function newPassword(formData: FormData) {
    // Create Supabase client with server-side cookie handling
    const supabase = createClient(cookies())
    
    // Extract new password from form data
    const password = formData.get("password")?.toString()

    // Validate that password is provided
    if (!password) {
        redirect(`/auth/reset-password/change?error=${encodeURIComponent("Password is required")}`)
    }

    // Update the user's password in Supabase Auth
    // This requires the user to be authenticated via the password reset token
    const { error } = await supabase.auth.updateUser({
        password
    })

    // If there's an error (e.g., password doesn't meet requirements, invalid token), redirect with error
    if (error) {
        redirect(`/auth/reset-password/change?error=${encodeURIComponent(error.message)}`)
    }

    // Success! Redirect to login page so user can sign in with new password
    redirect("/auth/login?success=Password reset successful. Please login with your new password.")
}