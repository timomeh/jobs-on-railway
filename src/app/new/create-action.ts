'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { actionClient, ActionError } from '@/lib/server-action'
import { slugify } from '@/lib/slugify'
import { createJob } from '@/data/jobs'

export const newJobAction = actionClient
  .schema(
    zfd.formData({
      command: zfd.text(z.string().min(1)),

      // intentionally called `jobName` and not `name` to prevent 1Password from
      // wanting to prefill it
      jobName: zfd.text(z.string().min(1)),
    }),
  )
  .action(async ({ parsedInput: { jobName, command } }) => {
    const slugFromName = slugify(jobName)
    const { error } = await createJob(slugFromName, command)

    if (error) {
      throw new ActionError(
        'Couldn’t create the job. Check your input, try a different name, or try again later.',
      )
    }

    revalidatePath('/')
    redirect('/')
  })
