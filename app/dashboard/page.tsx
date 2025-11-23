import { createClient } from "@/utils/supabase/server";
import { redirectIfNotAuthenticated } from "@/utils/redirects/redirectIfNotAuthenticated";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/ui/logout-button";

export default async function Dashboard() {
    await redirectIfNotAuthenticated()
    const supabase = await createClient(cookies())
    const {data:{user}} = await supabase.auth.getUser()

    return (
        <div className="max-w-2xl mx-auto pt-20 space-y-4">
            <div>Welcome, <b>{user?.email}</b></div>
            <p>This page is protected by Supabase Server Side Auth.</p>
            <LogoutButton />
        </div>
    )
}