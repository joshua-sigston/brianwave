import FormComponent from "@/components/form-component";
import { signup } from "../(auth)/actions";
import { redirectIfAuthenticated } from "@/utils/redirects/redirectIfAuthenticated";

export default async function SignUpPage() {
    await redirectIfAuthenticated();
    
    return (
        <div className="flex items-center justify-center px-3 min-h-screen">
            <FormComponent action={signup} type="signup" />
        </div>
    )
}