import { updateSession } from "@/utils/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSession(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // block paths that require auth
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response; // must return this!
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
  };