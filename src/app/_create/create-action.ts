'use server'

import { actionClient } from '@/lib/server-action'
import { z } from 'zod'
import { createRunbookService } from '@/data/create-runbook'
import { revalidatePath } from 'next/cache'
import { zfd } from 'zod-form-data'
import { slugify } from '@/lib/slugify'

const schema = zfd.formData({
  name: zfd.text(z.string().min(1)),
  command: zfd.text(z.string().min(1)),
})

export const createNewRunbookAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, command } }) => {
    const slugFromName = slugify(name)
    await createRunbookService(slugFromName, command)

    revalidatePath('/')
  })
