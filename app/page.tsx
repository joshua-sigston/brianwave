import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/ui/logout-button";
import { redirectIfAuthenticated } from "@/utils/redirects/redirectIfAuthenticated";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  await redirectIfAuthenticated()
  return (
    <main className="min-h-screen flex flex-col justify-center px-3">
      <div className=" p-6 max-w-xl mx-auto text-center">
        <h3 className="text-3xl font-bold">
          Brianwave
        </h3>
        <p>A thoughtfully minimal, ai assisted note app. Sign in and start capturing ideas, organize with tags, and get instant summaries.     
        </p>
      </div>
      <div className="flex justify-center space-x-5 ">
        <Button asChild variant="secondary">
          <Link href="/login">Get Started</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">Create Account</Link>
        </Button>
      </div>
      <div className="flex justify-center space-x-5 mt-7">
        {[
          ["Secure by default", "Row level security via Supabase Auth"],
          ["Dast & Modern", "Next.js App Router + Server Actions"],
          ["AI Summaries", "Turn long notes into quick insights"],
        ].map(([title, desc]) => (
          <div key={title} className="text-center border border-zinc-500 rounded-md p-2 bg-gray-400/25">
            <h3 className="font-extrabold tex-lg">{title}</h3>
            <p className="text-xs">{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
