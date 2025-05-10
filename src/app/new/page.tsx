import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

import { CreateJobForm } from './CreateJobForm'

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm font-semibold text-white/60 transition
          hover:text-white/80"
      >
        <ArrowLeftIcon className="size-4" />
        Back to your Jobs
      </Link>
      <h2 className="mt-10 mb-6 text-xl font-semibold">New Job</h2>
      <CreateJobForm />
    </main>
  )
}
