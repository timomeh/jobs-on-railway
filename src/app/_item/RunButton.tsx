'use client'

import { useAction } from 'next-safe-action/hooks'
import { runRunbookAction } from './run-action'

type Props = {
  serviceId: string
}

export function RunButton({ serviceId }: Props) {
  const { execute } = useAction(runRunbookAction.bind(null, serviceId))

  return (
    <form action={execute}>
      <button>Run now!</button>
    </form>
  )
}
