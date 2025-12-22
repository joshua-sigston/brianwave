"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newPasswordSchema } from "@/lib/validation"
import { Button } from "@/app/components/ui/button"
import { Form } from "@/app/components/ui/form"
import { useState } from "react"
// import { useRouter } from "next/navigation"
import Link from "next/link"
import { newPassword } from "@/app/(auth)/actions"
import { FormFieldComponent } from "./form-field-component"

export const NewPasswordForm = ({error, success}: {error?: string | null; success?: string | null}) => {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
          password: "",
          confirmPassword: "",
        },
      })

      async function onSubmit(values: z.infer<typeof newPasswordSchema>) {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("password", values.password)
        await newPassword(formData)
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
                        name="password" 
                        label="New Password" 
                        type="password" 
                        placeholder="********" 
                        form={form} 
                    />
                    <FormFieldComponent 
                        name="confirmPassword" 
                        label="Confirm Password" 
                        type="password" 
                        placeholder="********" 
                        form={form} 
                    />
                    <Button type="submit" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit"}</Button>
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