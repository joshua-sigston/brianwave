import Link from "next/link";

interface LinkContainerProps {
    href: string;
    title: string
}


export const LinkContainer = ({href, title}: LinkContainerProps) => {
  return (
    <div className="text-xl font-semibold bg-neutral-300 text-neutral-800 p-2 rounded-md shadow-md hover:bg-neutral-200 transition-all duration-300">
      <Link href={href}>{title}</Link>
    </div>
  )
}