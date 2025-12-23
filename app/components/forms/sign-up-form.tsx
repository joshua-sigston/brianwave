"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signUpSchema } from "@/lib/validation"
import { Button } from "@/app/components/ui/button"
import { Form } from "@/app/components/ui/form"
import { useState } from "react"
// import { useRouter } from "next/navigation"
import Link from "next/link"
import { signup } from "@/app/(auth)/actions"
import { FormFieldComponent } from "./form-field-component"

export const SignUpForm = ({error, success}: {error?: string | null; success?: string | null}) => {
    const [isLoading, setIsLoading] = useState(false)
    // const [error, setError] = useState<string | null>(null)
    // const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
          email: "",
          password: "",
          confirmPassword: "",
        },
      })

      async function onSubmit(values: z.infer<typeof signUpSchema>) {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("email", values.email)
        formData.append("password", values.password)
        formData.append("confirmPassword", values.confirmPassword)
        await signup(formData)
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
                    <FormFieldComponent 
                        name="password" 
                        label="Password" 
                        type="password" 
                        placeholder="********" 
                        form={form} 
                    />
                    <FormFieldComponent 
                        name="confirmPassword" 
                        label="ConfirmPassword" 
                        type="password" 
                        placeholder="********" 
                        form={form} 
                    />
                    <Button type="submit" disabled={isLoading}>{isLoading ? "Signing up..." : "Sign Up"}</Button>
                </form>
            </Form>
            <div className="text-center text-sm mt-3">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                    Sign in here
                </Link>
            </div>
        </div>
    )
}