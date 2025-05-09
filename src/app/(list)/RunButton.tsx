'use client'

import { useAction } from 'next-safe-action/hooks'
import { runJobAction } from './run-action'
import { SolidButton } from '../_comps/Button'
import { PlayIcon } from 'lucide-react'
import { LoadingLabel } from '../_comps/LoadingLabel'

type Props = {
  serviceId: string
}

export function RunButton({ serviceId }: Props) {
  const { execute, isPending } = useAction(runJobAction.bind(null, serviceId))

  return (
    <form action={execute}>
      <button type="submit" disabled={isPending}>
        <SolidButton>
          <LoadingLabel loading={isPending} label="Starting…">
            Run
            <PlayIcon />
          </LoadingLabel>
        </SolidButton>
      </button>
    </form>
  )
}
