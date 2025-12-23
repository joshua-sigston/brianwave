import { createClient } from "@/utils/supabase/server"
import { LogoutButton } from "../components/forms/logout-button"
import NotesForm from "../components/forms/notes-form"
import { cookies } from "next/headers"
import NoteCard from "../components/note-card"
import { Suspense } from "react"
import AuthFormContainer from "../components/forms/auth-form-container"



export default async function Dashboard() {
    const supabase = createClient(cookies())
    const {data: {user}} = await supabase.auth.getUser()
    const {data: notes} = await supabase.from("notes").select("*").eq("user_id", user?.id)
    
    
    return (
        <main className="h-content bg-linear-to-b from-teal-400 to-slate-800 pb-5">
            <header className="flex justify-between items-center bg-white p-5 relative w-full top-0 left-0 right-0 h-20 md:px-15">
                <p>{user?.email}</p>
                <LogoutButton />
            </header>

            <div className="mt-10 mx-3 md:mx-auto md:max-w-xl">
                <AuthFormContainer title="Notes" description="Create a new note">
                    <NotesForm />   
                </AuthFormContainer>
            </div>


            <div className="mt-10 mx-3 md:mx-auto md:max-w-xl space-y-5">
                {notes?.map((note) => (
                    <Suspense key={note.id} fallback={<div>Loading...</div>}>
                        <NoteCard note={note} />
                    </Suspense>
                ))}
            </div>
        </main>
    )
}