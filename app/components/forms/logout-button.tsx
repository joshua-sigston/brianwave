"use client"

import { logout } from "@/app/(auth)/actions"
import { Button } from "../ui/button"

export const LogoutButton = () => {

    const handleLogout = async () => {
        await logout()
    }

    return (
        <Button onClick={handleLogout} variant="destructive">Logout</Button>
    )
}
