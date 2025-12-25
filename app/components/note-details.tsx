"use client"
import { BotIcon, PenBoxIcon, TrashIcon } from "lucide-react"
import { Button } from "./ui/button"
import { deleteNote, generateSummary, updateNote } from "../(notes)/actions"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { noteSchema } from "@/lib/validation"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useRouter } from "next/navigation"

interface Note {
    id: string
    title: string
    content: string
    summary: string | null
}

export default function NoteDetails({note: initialNote}: {note: Note}) {
    const [isEditing, setIsEditing] = useState(false)
    const [note, setNote] = useState(initialNote)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: note.title,
            content: note.content,
        },
    })

    async function onSubmit(values: z.infer<typeof noteSchema>) {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("id", note.id)
        formData.append("title", values.title)
        formData.append("content", values.content)
        await updateNote(formData)
        setNote({ ...note, title: values.title, content: values.content })
        setIsEditing(false)
        setIsLoading(false)
        router.refresh()
    }

    return (
    <div className="mt-10 mx-3 md:mx-auto md:max-w-xl">
        <div className="bg-white p-5 rounded-md">
            {isEditing ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Note title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write your note here..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end items-center gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                    setIsEditing(false)
                                    form.reset()
                                }}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
                    <p className="whitespace-pre-wrap mb-4">{note.content}</p>
                    <h3 className="text-lg font-bold mb-2">AI Summary</h3>
                    <p className="whitespace-pre-wrap mb-4">{note.summary}</p>
                    <div className="flex justify-end items-center gap-2">
                    <form action={generateSummary}>
                        <input type="hidden" name="id" value={note.id} />
                        <Button type="submit" variant="outline">
                            <BotIcon size={16} color="blue" />
                        </Button>
                    </form>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                            <PenBoxIcon size={16} color="blue" />
                        </Button>
                        <form action={deleteNote}>
                            <input type="hidden" name="id" value={note.id} />
                            <Button type="submit" variant="outline">
                                <TrashIcon size={16} color="red" />
                            </Button>
                        </form>
                    </div>
                </>
            )}
        </div>
    </div>
    )
}