'use client'

import { useAction } from 'next-safe-action/hooks'
import { PlusIcon } from 'lucide-react'

import { Input } from '../_comps/Input'
import { SolidButton } from '../_comps/Button'
import { LoadingLabel } from '../_comps/LoadingLabel'
import { newJobAction } from './create-action'

export function CreateJobForm() {
  const { execute, result, isPending, input } = useAction(newJobAction)

  return (
    <form action={execute} role="form" className="grid max-w-md gap-6">
      <Input.Group error={!!result.validationErrors?.fieldErrors.jobName}>
        <Input.Label htmlFor="jobName" required>
          Job Name
        </Input.Label>
        <Input.Field
          type="text"
          name="jobName"
          id="jobName"
          error={!!result.validationErrors?.fieldErrors.jobName}
          defaultValue={(input as FormData)?.get('jobName')?.toString() || ''}
        />
        <Input.Hint id="jobName">
          Specify a name so you can find the job easier.
        </Input.Hint>
        <Input.Error id="jobName">
          {result.validationErrors?.fieldErrors.jobName}
        </Input.Error>
      </Input.Group>

      <Input.Group error={!!result.validationErrors?.fieldErrors.command}>
        <Input.Label htmlFor="command" required>
          Command
        </Input.Label>
        <Input.Field
          type="text"
          name="command"
          id="command"
          error={!!result.validationErrors?.fieldErrors.command}
          defaultValue={(input as FormData)?.get('command')?.toString() || ''}
        />
        <Input.Hint id="command">
          The shell command to run when the job executed. We’ll not yet run the
          job if you create it. You can run it later.
        </Input.Hint>
        <Input.Error id="command">
          {result.validationErrors?.fieldErrors.command}
        </Input.Error>
      </Input.Group>

      {result.serverError && (
        <p
          role="alert"
          aria-live="assertive"
          className="mt-2 text-sm text-red-400"
        >
          {result.serverError}
        </p>
      )}

      <div>
        <button type="submit" disabled={isPending}>
          <SolidButton>
            <LoadingLabel loading={isPending} label="Creating the job…">
              <PlusIcon />
              Create
            </LoadingLabel>
          </SolidButton>
        </button>
        <p className="mt-2 text-sm text-white/60"></p>
      </div>
    </form>
  )
}
