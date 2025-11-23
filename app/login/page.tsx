
import { redirectIfAuthenticated } from "@/utils/redirects/redirectIfAuthenticated"
import { login } from "../(auth)/actions"
import FormComponent from "@/components/form-component"


export default async function LoginPage() {
    await redirectIfAuthenticated()

    return (
        <div className=" flex items-center justify-center px-3 min-h-screen">
            <FormComponent action={login} type="login" />
        </div>
    )
}