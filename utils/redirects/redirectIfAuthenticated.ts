import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { cookies } from "next/headers";

export async function redirectIfAuthenticated(path = "/dashboard") {
    const supabase = createClient(cookies());
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        redirect(path);
    }
}