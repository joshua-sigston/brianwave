import { PencilIcon, TrashIcon } from "lucide-react"
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
    // Format date to day/month/year
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    // console.log("Note component - note.id:", note.id)
    return (
        <div className="bg-slate-300 p-5 rounded-md">
            <h2 className="text-lg font-bold">{note.title}</h2>
            <p>{note.content.substring(0,100)}...</p>
            <div className="flex justify-between items-center mt-3">
                <small className="text-sm text-gray-500">{formatDate(note.created_at)}</small>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Link href={`/notes/${note.id}`}>
                            <PencilIcon size={16} color="blue" />
                        </Link>
                    </Button>
                    <form action={deleteNote}>
                    <input type="hidden" name="id" value={note.id} />
                    <Button type="submit" variant="outline">
                        <TrashIcon size={16} color="red" />
                    </Button>
                </form>
                </div>
            </div>
        </div>
    )
}