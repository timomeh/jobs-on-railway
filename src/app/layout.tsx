import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'

import { SolidButton } from './_comps/Button'

import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Jobs on Railway',
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`${inter.variable} motion-safe:**:focus-visible:animate-outline-bounce
        **:focus-visible:outline-2 **:focus-visible:outline-offset-4
        **:focus-visible:outline-fuchsia-600`}
    >
      <body>
        <div className="grid gap-12 pb-20">
          <header className="border-b border-white/5 bg-black/10">
            <div className="mx-auto flex w-full max-w-3xl justify-between px-5 py-6">
              <h1 className="text-xl font-semibold">
                <Link href="/">Jobs on Railway</Link>
              </h1>
              <Link href="/new">
                <SolidButton>
                  <PlusIcon />
                  Create
                </SolidButton>
              </Link>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  )
}
