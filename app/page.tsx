import { LinkContainer } from "./components/link-container";


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
    <main className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-b from-teal-400 to-slate-800 ">
      <h1 className="text-4xl font-bold text-neutral-300">Supabase Auth Example</h1>
      <div className="flex flex-col items-center justify-center text-center gap-y-4 p-3 md:flex-row md:gap-x-4 w-screen">
        {links.map((link) => (
          <LinkContainer key={link.href} href={link.href} title={link.title} />
        ))}
      </div>
    </main>
  );
}
