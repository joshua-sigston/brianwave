import Link from "next/link";
import { LinkContainer } from "./components/link-container";

export const dynamic = "force-dynamic"


const links = [
  {
    "title": "Log In",
    "href": "/auth/login"
  },
  {
    "title": "Sign Up",
    "href": "/auth/sign-up"
  },
  {
    "title": "Reset Password",
    "href": "/auth/reset-password/request"
  }
]

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center space-y-4 h-screen text-center bg-linear-to-b from-teal-400 to-slate-800 ">
      <h1 className="text-4xl font-bold text-neutral-300">Welcome to the Note App</h1>
      <p className="text-lg text-neutral-300">This is a simple note app built with Next.js, Supabase, and Tailwind CSS.</p>
      <Link href="/dashboard" className="text-lg text-neutral-300">To Get Started Please Select a Link Below</Link>
      <h1 className="text-4xl font-bold text-neutral-300">Supabase Auth Example</h1>
      <div className="flex flex-col items-center justify-center text-center gap-y-4 p-3 md:flex-row md:gap-x-4 w-screen">
        {links.map((link) => (
          <LinkContainer key={link.href} href={link.href} title={link.title} />
        ))}
      </div>
    </main>
  );
}
