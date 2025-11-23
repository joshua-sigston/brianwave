"use server"

import { createActionClient } from "@/utils/supabase/actions"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
    const supabase = await createActionClient()
    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    })
    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }
   redirect("/dashboard")
}

export async function signup(formData: FormData) {
    const supabase = await createActionClient()
    const { data, error } = await supabase.auth.signUp({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    })
    if (error) {
        redirect(`/sign-up?error=${encodeURIComponent(error.message)}`)
    }
   redirect("/dashboard")
}

export async function logout() {
    const supabase = await createActionClient()
    await supabase.auth.signOut()
    redirect("/login")
}