import { deleteNote, generateSummary } from "@/app/(notes)/actions"
import { LogoutButton } from "@/app/components/forms/logout-button"
import NoteDetails from "@/app/components/note-details"
import NoteSummary from "@/app/components/note-summary"
import { Button } from "@/app/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { ArrowLeftIcon } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function NotePage({params}: {params: Promise<{id: string}>}) {
    const supabase = createClient(cookies())
    const {id} = await params
    const {data: note} = await supabase.from("notes").select("*").eq("id", id).single()
    
    
    if (!note) {
        notFound()
    }

    return (
        <main className="h-screen bg-linear-to-b from-teal-400 to-slate-800 pb-5">
            <header className="flex justify-between items-center bg-white p-5 relative w-full top-0 left-0 right-0 h-20 md:px-15">
                <p>{note.title}</p>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Button variant="outline">
                            <ArrowLeftIcon size={16} color="blue" />
                        </Button>
                    </Link>
                    <LogoutButton />
                </div>
            </header>

            <NoteDetails note={note} />
        </main>
    )
}