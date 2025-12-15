import AuthFormContainer from '@/app/components/forms/auth-form-container';
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from 'next';
import { NewPasswordForm } from '@/app/components/forms/new-password-form';

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Create a new password',
  };

export default async function NewPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{error?: string; success?: string; code?: string; type?: string}>
}) {
    const params = await searchParams
    const errorMessage = params?.error ? decodeURIComponent(params.error) : null
    const successMessage = params?.success ? decodeURIComponent(params.success) : null
    
    // If there's a code in the URL, redirect to callback route to handle code exchange properly
    // The callback route will then redirect back here with the session established
    if (params?.code) {
        redirect(`/auth/callback?code=${params.code}&type=recovery`)
    }
    
    const supabase = createClient(cookies())
    
    // Verify user has a session (required for password update)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (!user || userError) {
        const noSessionError = "You must be authenticated to reset your password. Please use the link from your email."
        return (
            <AuthFormContainer title="Reset Password" description="Create a new password">
                <NewPasswordForm error={noSessionError} success={successMessage} />
            </AuthFormContainer>
        )
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-teal-400 to-slate-800">
            <AuthFormContainer title="Reset Password" description="Create a new password">
                <NewPasswordForm error={errorMessage} success={successMessage} />
            </AuthFormContainer>
        </div>
    )
}