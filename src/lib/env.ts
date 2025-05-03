import 'server-only'

import { z } from 'zod'

const envSchema = z.object({
  /** Project Token for the Railway Environment in which runbooks are managed */
  RAILWAY_API_TOKEN: z.string().nonempty(),

  /** Railway Environment ID in which runbooks are managed */
  RAILWAY_ENVIRONMENT_ID: z.string().nonempty(),

  /** Railway Project ID in which runbooks are managed */
  RAILWAY_PROJECT_ID: z.string().nonempty(),

  /** Repo to checkout and run runbooks */
  RUNBOOKS_REPO: z.string().nonempty(),
})

let env: z.infer<typeof envSchema>

// ensure env vars are configured
env = envSchema.parse(process.env)

export { env }
