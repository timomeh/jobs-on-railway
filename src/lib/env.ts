import 'server-only'

import { z } from 'zod'

const envSchema = z.object({
  /** Project Token for the Railway Environment in which jobs are managed */
  RAILWAY_API_TOKEN: z.string().nonempty(),

  /** Railway Environment ID in which jobs are managed */
  RAILWAY_ENVIRONMENT_ID: z.string().nonempty(),

  /** Railway Project ID in which jobs are managed */
  RAILWAY_PROJECT_ID: z.string().nonempty(),

  /** Repo to checkout and run jobs */
  JOBS_REPO: z.string().nonempty(),
})

// ensure env vars are configured
const env = envSchema.parse(process.env)

export { env }
