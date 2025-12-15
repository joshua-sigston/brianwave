import { headers } from "next/headers"

/**
 * Gets the origin URL for the current request
 * Used for email redirect URLs and other absolute URL needs
 */
export async function getOrigin(): Promise<string> {
  const headersList = await headers()
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    `${headersList.get('x-forwarded-proto') || 'http'}://${headersList.get('host') || 'localhost:3000'}`
  )
}

