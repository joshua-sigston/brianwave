import AuthFormContainer from '@/app/components/forms/auth-form-container';
import { SignUpForm } from '@/app/components/forms/sign-up-form';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};



export const SignUpPage = async ({
    searchParams,
}: {
    searchParams: Promise<{error?: string; success?: string}>
}) => {
    const params = await searchParams
    const errorMessage = params?.error ? decodeURIComponent(params.error) : null
    const successMessage = params?.success ? decodeURIComponent(params.success) : null

    return (
        <main className="h-screen flex items-center justify-center bg-gradient-to-b from-teal-400 to-slate-800">
            <AuthFormContainer title="Sign Up" description="Create a new account">
                <SignUpForm error={errorMessage} success={successMessage} />
            </AuthFormContainer>
        </main>
 
    )
}

export default SignUpPage;