"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function createNote(formData: FormData) {
    const supabase = createClient(cookies())

    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const title = formData.get("title")?.toString()
    const content = formData.get("content")?.toString()
    

    if (!title || !content) {
        redirect("/notes?error=Title and content are required")
    }

    const {error} = await supabase.from("notes").insert([{
        user_id: user.id,
        title,
        content
    }])

    if (error) {
        redirect("/notes?error=Failed to create note")
    }

    revalidatePath("/dashboard")
}

export async function updateNote(formData: FormData) {
    const supabase = createClient(cookies())

    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const id = formData.get("id")?.toString() || ""
    const title = formData.get("title")?.toString() || ""
    const content = formData.get("content")?.toString() || ""

    if (!id || !title || !content) {
        redirect("/notes?error=Note ID, title, and content are required")
    }

    const {error} = await supabase.from("notes").update({
        title,
        content
    }).eq("id", id).eq("user_id", user.id)
    
    revalidatePath("/dashboard")
    revalidatePath(`/notes/${id}`)

}

export async function deleteNote(formData: FormData) {
    const supabase = createClient(cookies())

    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const id = String(formData.get("id") || "")

    if (!id) redirect("/dashboard?error=Note ID is required")
    
    await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id)

    revalidatePath("/dashboard")
    redirect("/dashboard")
}