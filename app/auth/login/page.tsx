import AuthFormContainer from '@/app/components/forms/auth-form-container';
import { LoginForm } from '@/app/components/forms/login-form';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log into your account',
};

export const LogInPage = async({searchParams}: {searchParams: Promise<{error?: string; success?: string}>}) => {
    const params = await searchParams
    const errorMessage = params?.error ? decodeURIComponent(params.error) : null
    const successMessage = params?.success ? decodeURIComponent(params.success) : null

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-teal-400 to-slate-800">
            <AuthFormContainer title="Log In" description="Log into your Account">
                <LoginForm error={errorMessage} success={successMessage} />   
            </AuthFormContainer>
        </div>
    )
}

export default LogInPage;