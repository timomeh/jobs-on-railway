'use client'

import { useAction } from 'next-safe-action/hooks'
import { createNewRunbookAction } from './create-action'

export function CreateRunbookForm() {
  const { execute } = useAction(createNewRunbookAction)

  return (
    <form action={execute}>
      <input type="text" name="name" placeholder="Runbook Name" />
      <input
        type="text"
        name="command"
        placeholder="command to run inside docker"
      />
      <button type="submit">Create</button>
    </form>
  )
}
