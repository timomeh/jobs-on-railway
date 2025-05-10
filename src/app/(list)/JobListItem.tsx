import { Job } from '@/data/jobs'
import { SolidButton } from '../_comps/Button'
import { LoadingLabel } from '../_comps/LoadingLabel'
import { RunButton } from './RunButton'

type Props = {
  job: Job
}

export function JobListItem({ job }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="font-semibold">{job.name}</div>
        <div
          className="max-w-[180px] truncate rounded-full border border-fuchsia-300/20 px-2 py-1
            font-mono text-xs leading-none"
        >
          {job.command}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-fuchsia-100/40">
          {job.lastRunAt ? (
            <>
              Last run{' '}
              <span className="tabular-nums">
                {job.lastRunAt.toLocaleString(['en-US'], {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </span>
            </>
          ) : (
            'Never ran'
          )}
        </div>

        {job.status === 'idle' && <RunButton serviceId={job.id} />}
        {job.status === 'running' && (
          <button type="button" disabled>
            <SolidButton>
              <LoadingLabel loading label="Running job…" />
            </SolidButton>
          </button>
        )}
      </div>
    </div>
  )
}
