import assert from 'node:assert'
import { cache } from 'react'

import { env } from '@/lib/env'
import {
  createService,
  DeploymentStatus,
  deployService,
  listServices,
  updateService,
} from '@/lib/railway'

/**
 * Creates and configures new service to act as a one-off job.
 */
export const createJob = async (slug: string, command: string) => {
  const serviceId = await createService({
    name: `job-${slug}`,
    dockerfile: 'scripts/Dockerfile',
    repo: env.JOBS_REPO,
  })

  const hasUpdated = await updateService(serviceId, {
    startCommand: command,
  })

  if (!hasUpdated) {
    return { ok: false, error: 'not_updated' } as const
  }

  return { ok: true } as const
}

/**
 * Returns a list of all configured jobs.
 */
export const listJobs = cache(async () => {
  const services = await listServices()

  // Filter all services which start with `job-`
  const jobServices = services
    .filter((service) => service.serviceName.startsWith('job-'))
    .map((service) => ({
      name: service.serviceName.replace(/^job-/, ''),
      command: service.startCommand,
      id: service.serviceId,
      status: mapJobStatus(service.latestDeployment?.status),
      lastRunAt: service.latestDeployment?.createdAt
        ? new Date(service.latestDeployment.createdAt)
        : null,
    }))

  return jobServices
})

export type Job = Awaited<ReturnType<typeof listJobs>>[0]

/**
 * Runs a job.
 */
export const runJob = async (serviceId: string) => {
  await deployService(serviceId)
}

type JobStatus = 'idle' | 'running'

function mapJobStatus(serviceStatus?: DeploymentStatus) {
  if (!serviceStatus) return 'idle'

  const mapping: Record<DeploymentStatus, JobStatus> = {
    BUILDING: 'running',
    CRASHED: 'idle',
    DEPLOYING: 'running',
    FAILED: 'idle',
    INITIALIZING: 'running',
    NEEDS_APPROVAL: 'running',
    QUEUED: 'running',
    REMOVED: 'idle',
    SKIPPED: 'idle',
    SLEEPING: 'idle',
    SUCCESS: 'idle',
    WAITING: 'running',
    REMOVING: 'idle',
  }

  const mappedStatus = mapping[serviceStatus]
  assert(mappedStatus)

  return mappedStatus
}
