import AuthFormContainer from '@/app/components/forms/auth-form-container';
import { RequestPasswordReset } from '@/app/components/forms/request-password-reset';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Request to Reset Password',
    description: 'Forgot Password',
  };

export default async function RequestResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{error?: string; success?: string}>
}) {
    const params = await searchParams
    const errorMessage = params?.error ? decodeURIComponent(params.error) : null
    const successMessage = params?.success ? decodeURIComponent(params.success) : null

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-teal-400 to-slate-800">
        <AuthFormContainer title="Forgot Password" description="Type your email to reset your password">
            
            <RequestPasswordReset error={errorMessage} success={successMessage} />
        </AuthFormContainer>
        </div>
    )
}