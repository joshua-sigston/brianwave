"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Server action for creating a new note
 * 
 * Creates a new note in the database associated with the currently authenticated user.
 * Requires user to be logged in and validates that both title and content are provided.
 * 
 * @param formData - Form data containing title and content fields
 * @returns Revalidates the dashboard page cache after successful creation
 */
export async function createNote(formData: FormData) {
    // Create Supabase client with server-side cookie handling
    const supabase = createClient(cookies())

    // Get the currently authenticated user
    const {data: {user}} = await supabase.auth.getUser()

    // If no user is authenticated, redirect to login page
    if (!user) {
        redirect("/auth/login")
    }

    // Extract title and content from form data
    const title = formData.get("title")?.toString()
    const content = formData.get("content")?.toString()
    

    // Validate that both title and content are provided
    if (!title || !content) {
        redirect("/notes?error=Title and content are required")
    }

    // Insert the new note into the database
    // Associate it with the current user via user_id
    const {error} = await supabase.from("notes").insert([{
        user_id: user.id,
        title,
        content
    }])

    // If there's an error inserting the note, redirect with error message
    if (error) {
        redirect("/notes?error=Failed to create note")
    }

    // Revalidate the dashboard page cache to show the new note immediately
    revalidatePath("/dashboard")
}

/**
 * Server action for updating an existing note
 * 
 * Updates the title and content of a note. Only allows updates to notes owned by the current user.
 * Also clears the summary field since the note content has changed.
 * 
 * @param formData - Form data containing id, title, and content fields
 * @returns Revalidates both dashboard and individual note page caches
 */
export async function updateNote(formData: FormData) {
    // Create Supabase client with server-side cookie handling
    const supabase = createClient(cookies())

    // Get the currently authenticated user
    const {data: {user}} = await supabase.auth.getUser()

    // If no user is authenticated, redirect to login page
    if (!user) {
        redirect("/auth/login")
    }

    // Extract id, title, and content from form data
    const id = formData.get("id")?.toString() || ""
    const title = formData.get("title")?.toString() || ""
    const content = formData.get("content")?.toString() || ""

    // Validate that id, title, and content are all provided
    if (!id || !title || !content) {
        redirect("/notes?error=Note ID, title, and content are required")
    }

    // Update the note in the database
    // Use both id and user_id in the WHERE clause to ensure user can only update their own notes
    // Set summary to null since the content has changed and the summary is no longer valid
    const {error} = await supabase.from("notes").update({
        title,
        content,
        summary: null
    }).eq("id", id).eq("user_id", user.id)
    
    // Revalidate cache for both dashboard (note list) and individual note page
    revalidatePath("/dashboard")
    revalidatePath(`/notes/${id}`)

}

/**
 * Server action for deleting a note
 * 
 * Permanently deletes a note from the database. Only allows deletion of notes owned by the current user.
 * After deletion, redirects back to the dashboard.
 * 
 * @param formData - Form data containing id field
 * @returns Redirects to dashboard after successful deletion
 */
export async function deleteNote(formData: FormData) {
    // Create Supabase client with server-side cookie handling
    const supabase = createClient(cookies())

    // Get the currently authenticated user
    const {data: {user}} = await supabase.auth.getUser()

    // If no user is authenticated, redirect to login page
    if (!user) {
        redirect("/auth/login")
    }

    // Extract note id from form data
    const id = String(formData.get("id") || "")

    // Validate that note id is provided
    if (!id) redirect("/dashboard?error=Note ID is required")
    
    // Delete the note from the database
    // Use both id and user_id in the WHERE clause to ensure user can only delete their own notes
    await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id)

    // Revalidate the dashboard cache to remove the deleted note from the list
    revalidatePath("/dashboard")
    
    // Redirect back to dashboard
    redirect("/dashboard")
}

/**
 * Helper function to call OpenAI API for generating note summaries
 * 
 * Sends a request to OpenAI's chat completion API to generate a concise summary of the note content.
 * Uses GPT-4o-mini model with low temperature for consistent, focused summaries.
 * 
 * @param apiKey - OpenAI API key for authentication
 * @param content - The note content to summarize (truncated to 3000 characters)
 * @returns The generated summary text
 * @throws Error if the API request fails or no summary is returned
 */
export async function callLLM(apiKey: string, content: string) {
    // Create a prompt asking for a 2-3 sentence summary
    // Limit content to first 3000 characters to stay within token limits
    const prompt = `Summarize the following note in 2–3 concise sentences. Focus on key points and next steps if any.\n\n${(content || '').slice(0, 3000)}`
    
    // Make API request to OpenAI's chat completions endpoint
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",

        },
        body: JSON.stringify({
            model: "gpt-4o-mini", // Fast and cost-effective model for summaries
            messages: [
                {role: "system", content: "You are a concise assistant"},
                {role: "user", content: prompt}
            ],
            temperature: 0.2, // Low temperature for more deterministic, focused responses
            max_tokens: 1000, // Limit response length
        })
    })

    // If the API request failed, extract error details and throw
    if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}))
        throw new Error(`Failed to generate summary: ${errorData.error?.message || resp.statusText}`)
    }

    // Parse the API response
    const data = await resp.json()
    
    // Extract the summary text from the response
    // OpenAI returns: data.choices[0].message.content
    const summary = data.choices?.[0]?.message?.content?.trim()
    
    // Validate that we received a summary
    if (!summary) {
        throw new Error("No summary content returned from API")
    }
    
    return summary
}

/**
 * Server action for generating an AI summary of a note
 * 
 * Retrieves a note, generates a summary using OpenAI's API, and saves it back to the database.
 * Only works for notes owned by the current user. Requires OPENAI_API_KEY environment variable.
 * 
 * @param formData - Form data containing id field (the note ID to summarize)
 * @returns Redirects to the note page after successful summary generation
 */
export async function generateSummary(formData: FormData) {
    console.log("Generating summary for note:", formData.get("id"))
    
    // Create Supabase client with server-side cookie handling
    const supabase = createClient(cookies())

    // Get the currently authenticated user
    const {data: {user}} = await supabase.auth.getUser()

    // If no user is authenticated, redirect to login page
    if (!user) {
        redirect("/auth/login")
    }

    // Extract note id from form data
    const id = String(formData.get("id") || "")

    // Validate that note id is provided
    if (!id) redirect("/dashboard?error=Note ID is required")

    // Fetch the note from the database
    // Only select the note if it belongs to the current user (security check)
    const {data: note} = await supabase.from("notes").select("id, user_id, title, content").eq("id", id).eq("user_id", user.id).single()

    // Double-check that note exists and belongs to the current user
    if (!note || note.user_id !== user.id) redirect("/dashboard?error=Unauthorized access")

    // Get OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY

    // Validate that API key is configured
    if (!apiKey) {
        redirect(`/notes/${id}?error=OpenAI API key is not set`)
    }

    // Generate summary using OpenAI API
    console.log("Generating summary for note:", note.id)
    const summary = await callLLM(apiKey, note.content)

    // Update the note in the database with the generated summary
    await supabase.from("notes").update({summary}).eq("id", id).eq("user_id", user.id)

    // Revalidate cache for both dashboard and individual note page to show the new summary
    revalidatePath("/dashboard")
    revalidatePath(`/notes/${id}`)

    // Redirect back to the note page to display the generated summary
    console.log("redirecting to note:", id)
    redirect(`/notes/${id}`)
}