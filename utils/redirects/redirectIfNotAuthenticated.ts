import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { cookies } from "next/headers";

export async function redirectIfNotAuthenticated(path = "/login") {
    const supabase = createClient(cookies())
    const {data} = await supabase.auth.getUser()

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(path);
    }

    return user

}