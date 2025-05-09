'use server'

import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { revalidatePath } from 'next/cache'
import { actionClient } from '@/lib/server-action'
import { runJob } from '@/data/jobs'

export const runJobAction = actionClient
  .schema(zfd.formData({}))
  .bindArgsSchemas<[serviceId: z.ZodString]>([z.string()])
  .action(async ({ bindArgsParsedInputs: [serviceId] }) => {
    await runJob(serviceId)
    revalidatePath('/')
  })
