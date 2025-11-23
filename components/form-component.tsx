"use client"

import { Input } from "@/components/ui/input"
import SubmitButton from "@/components/submit-button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FormComponentProps {
    action: (formData: FormData) => Promise<void>
    className?: string
    type: "login" | "signup"
}

export default function FormComponent({
    action,
    className,
    type
}: FormComponentProps) {
    return (
        <Card className={`w-full max-w-sm bg-zinc-900 text-white ${className || ""}`}>
            <CardHeader>
                <CardTitle>{type === "login" ? "Login to your account" : "Create an account"}</CardTitle>
                <CardDescription className="text-zinc-400">
                {type === "login" 
                    ? "Enter your email below to login to your account"
                    : "Enter your email below to create your account"}
                </CardDescription>
                <CardAction>
                {type === "login" ? (
                    <Button asChild variant="link">
                        <Link href="/sign-up">Sign Up</Link>
                    </Button>
                ) : (
                    <Button asChild variant="link">
                        <Link href="/login">Login</Link>
                    </Button>
                )}
                </CardAction>
            </CardHeader>
            <CardContent>
                <form action={action}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    {/* <div className="flex items-center">
                        <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                        Forgot your password?
                        </a>
                    </div> */}
                        <Input id="password" name="password" type="password" required />
                    </div>
                    {/* {type === "signup" && (
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" required />
                        </div>
                    )} */}
                </div>
                <div className="mt-5">
                    <SubmitButton pendingText={type === "login" ? "Logging in..." : "Signing up..."}>{type === "login" ? "Login" : "Sign up"}</SubmitButton>
                </div>
                </form>
                {type === "login" && (
                    <CardFooter className="flex justify-between mt-5">
                        <p>Dont have an account?</p> <Link href="/sign-up">Sign up</Link>
                    </CardFooter>
                )}
            </CardContent>
            </Card>
    )
}