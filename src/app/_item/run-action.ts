'use server'

import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { actionClient } from '@/lib/server-action'
import { runRunbookService } from '@/data/run-runbook'
import { revalidatePath } from 'next/cache'

const schema = zfd.formData({})

export const runRunbookAction = actionClient
  .schema(schema)
  .bindArgsSchemas<[serviceId: z.ZodString]>([z.string()])
  .action(async ({ bindArgsParsedInputs: [serviceId] }) => {
    await runRunbookService(serviceId)
    revalidatePath('/')
  })
