"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/app/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { FormFieldComponent } from "./form-field-component"
import { Textarea } from "@/app/components/ui/textarea"
import { useState } from "react"
import { createNote } from "@/app/(notes)/actions"
import { noteSchema } from "@/lib/validation"

export default function NotesForm() {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    })

    async function onSubmit(values: z.infer<typeof noteSchema>) {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        const formData = new FormData()
        formData.append("title", values.title)
        formData.append("content", values.content)
        await createNote(formData)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormFieldComponent
                    name="title" 
                    label="Title" 
                    type="text" 
                    form={form} 
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
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>{isLoading ? "Submitting note..." : "Add"}</Button>
            </form>
        </Form>
    )
}