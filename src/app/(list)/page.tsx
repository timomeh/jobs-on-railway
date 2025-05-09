import { PlusIcon, SquareTerminalIcon } from 'lucide-react'
import Link from 'next/link'
import { listJobs } from '@/data/jobs'
import { SolidButton } from '../_comps/Button'
import { Poll } from './Poll'
import { JobListItem } from './JobListItem'

export default async function Page() {
  const jobs = await listJobs()

  const hasRunningJob = jobs.some((job) => job.status === 'running')

  return (
    <main className="mx-auto w-full max-w-3xl px-5">
      {hasRunningJob && <Poll interval={5_000} />}

      {jobs.length < 1 && <NoJobs />}

      {jobs.length > 0 && (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} className="border-b border-fuchsia-300/20 py-4">
              <JobListItem job={job} />
            </li>
          ))}
        </ul>
      )}

      {jobs.length > 0 && (
        <div className="mt-8">
          <Link href="/new">
            <SolidButton>
              <PlusIcon />
              Add another job
            </SolidButton>
          </Link>
        </div>
      )}
    </main>
  )
}

function NoJobs() {
  return (
    <Link
      href="/new"
      className="group/btn flex w-full flex-col items-center justify-center rounded-lg border-2
        border-dashed border-white/50 p-12 text-center opacity-60 transition
        hover:opacity-100"
    >
      <SquareTerminalIcon className="mb-2 size-6" />
      <div className="text-sm font-semibold text-white">Create a new job</div>
    </Link>
  )
}
