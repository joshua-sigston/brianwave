import { TrashIcon } from "lucide-react"
import { Button } from "./ui/button"
import { deleteNote } from "../(notes)/actions"
import Link from "next/link"

interface NoteProps {
    note: {
        id: string
        title: string
        content: string
        created_at: string
    }
}

export default function NoteCard({note}: NoteProps) {
    console.log("Note component - note.id:", note.id)
    return (
        <div className="bg-slate-300 p-5 rounded-md">
            <h2 className="text-lg font-bold">{note.title}</h2>
            <p>{note.content.substring(0,100)}...
                <Link href={`/notes/${note.id}`}>Read more</Link>
            </p>
            <div className="flex justify-between items-center">
                <small className="text-sm text-gray-500">{note.created_at}</small>
                <form action={deleteNote}>
                    <input type="hidden" name="id" value={note.id} />
                    <Button type="submit" variant="outline">
                        <TrashIcon size={16} color="red" />
                    </Button>
                </form>
            </div>
        </div>
    )
}