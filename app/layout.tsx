import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MailClient",
  description: "This is a Mail Client in development",
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  // h-dvh is mobile only, hides the browser ui upon scrolling
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col justify-between w-full h-dvh min-h-screen">
          <main className="flex-auto w-full h-dvh bg-gray-100">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
