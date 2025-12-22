"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { requestPasswordResetSchema } from "@/lib/validation"
import { Button } from "@/app/components/ui/button"
import { Form } from "@/app/components/ui/form"
import { useState } from "react"
import Link from "next/link"
import { requestPasswordReset } from "@/app/(auth)/actions"
import { FormFieldComponent } from "./form-field-component"

export const RequestPasswordReset = ({error, success}: {error?: string | null; success?: string | null}) => {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof requestPasswordResetSchema>>({
        resolver: zodResolver(requestPasswordResetSchema),
        defaultValues: {
          email: "",
        },
      })

      async function onSubmit(values: z.infer<typeof requestPasswordResetSchema>) {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("email", values.email)
        await requestPasswordReset(formData)
      }

      return (
        <div className="md:min-w-md">
            {success && (
                <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                </div>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormFieldComponent 
                        name="email" 
                        label="Email" 
                        type="email" 
                        placeholder="your@email.com" 
                        form={form} 
                    />
                    <Button type="submit" disabled={isLoading}>{isLoading ? "Sending..." : "Send Reset Link"}</Button>
                </form>
            </Form>
            <div className="text-center text-sm mt-5">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                    Log in here
                </Link>
            </div>
        </div>
    )

}