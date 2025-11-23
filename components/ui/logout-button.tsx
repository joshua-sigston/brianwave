import { logout } from "@/app/(auth)/actions"
import { Button } from "./button"

export function LogoutButton() {
    return (
       <form action={logout}>
         <Button type="submit" variant="destructive">Logout</Button>
       </form>
    )
}