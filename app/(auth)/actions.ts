"use server"

import { getOrigin } from "@/lib/auth-utils"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"


export async function signup(formData: FormData) {
    const supabase = createClient(cookies())
    const email = formData.get("email")?.toString()
    const password = formData.get("password")?.toString()

    if (!email || !password) {
        redirect(`/auth/sign-up?error=${encodeURIComponent("Email and password are required")}`)
    }

    const origin = await getOrigin()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`
        }
    })

    if (error) {
        redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`)
    }

    // Redirect to signup page with success message
    // User needs to confirm email before accessing dashboard
    redirect(`/auth/sign-up?success=${encodeURIComponent("Account created successfully! Please check your email to confirm your account.")}`)
}

export async function login(formData: FormData) {
    const supabase = createClient(cookies())
    const email = formData.get("email")?.toString()
    const password = formData.get("password")?.toString()

    if (!email || !password) {
        redirect(`/auth/login?error=${encodeURIComponent("Email and password are required")}`)
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
    }

    redirect("/dashboard")
}

export async function logout() {
    const supabase = createClient(cookies())

    await supabase.auth.signOut()
    redirect("/auth/login")
}

export async function requestPasswordReset(formData: FormData) {
    const supabase = createClient(cookies())
    const email = formData.get("email")?.toString()

    if (!email) {
        redirect(`/auth/reset-password/request?error=${encodeURIComponent("Email is required")}`)
    }

    const origin = await getOrigin()

    // Use Supabase Auth to send password reset email
    // This checks against Authentication users, not database tables
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password/change`,
    })

    if (error) {
        redirect(`/auth/reset-password/request?error=${encodeURIComponent(error.message)}`)
    }

    // Always redirect with success message (for security, don't reveal if email exists)
    redirect(`/auth/reset-password/request?success=If an account exists with this email, a password reset link has been sent.`)
}

export async function newPassword(formData: FormData) {
    const supabase = createClient(cookies())
    const password = formData.get("password")?.toString()

    if (!password) {
        redirect(`/auth/reset-password/change?error=${encodeURIComponent("Password is required")}`)
    }

    const { error } = await supabase.auth.updateUser({
        password
    })

    if (error) {
        redirect(`/auth/reset-password/change?error=${encodeURIComponent(error.message)}`)
    }

    // Success! Redirect to login page
    redirect("/auth/login?success=Password reset successful. Please login with your new password.")
}