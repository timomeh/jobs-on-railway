import {
  createService,
  deployService,
  listServices,
  updateService,
} from '@/lib/railway'

import { createJob, listJobs, runJob } from './jobs'

describe('createJob', () => {
  beforeEach(() => {
    vi.mocked(createService).mockResolvedValue('service-id-123')
  })

  it('returns ok', async () => {
    await expect(createJob('foo', 'bar')).resolves.toEqual({ ok: true })
  })

  it('creates a service with the specified slug and job prefix', async () => {
    await createJob('test-slug', 'some mock cmd')

    expect(createService).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'job-test-slug',
      }),
    )
  })

  it('updates the service with the specified command', async () => {
    await createJob('test-slug', 'some mock cmd')

    expect(updateService).toHaveBeenCalledWith('service-id-123', {
      startCommand: 'some mock cmd',
    })
  })

  describe('with an error during update', () => {
    beforeEach(() => {
      vi.mocked(updateService).mockResolvedValue(false)
    })

    it('returns an error code', async () => {
      await expect(createJob('foo', 'bar')).resolves.toEqual({
        ok: false,
        error: 'not_updated',
      })
    })
  })
})

describe('listJobs', () => {
  beforeEach(() => {
    vi.mocked(listServices).mockResolvedValue([
      {
        serviceName: 'job-mock-service-idle',
        startCommand: 'mock command',
        serviceId: 'mocked-service-id',
        latestDeployment: {
          status: 'SUCCESS',
          createdAt: '2025-05-01T14:00:00.000Z',
        },
      },
      {
        serviceName: 'job-mock-service-building',
        startCommand: 'mock command',
        serviceId: 'mocked-service-id',
        latestDeployment: {
          status: 'BUILDING',
          createdAt: '2025-05-01T14:00:00.000Z',
        },
      },
      {
        serviceName: 'not a job',
        startCommand: 'whatever',
        serviceId: 'mocked-service-id',
        latestDeployment: {
          status: 'SUCCESS',
          createdAt: '2025-05-01T14:00:00.000Z',
        },
      },
    ])
  })

  it('returns only services with the job prefix', async () => {
    const jobs = await listJobs()

    expect(jobs).toHaveLength(2)
    expect(jobs).toMatchObject([
      { name: 'mock-service-idle' },
      { name: 'mock-service-building' },
    ])
  })

  it('returns a mapped data representation', async () => {
    const jobs = await listJobs()

    expect(jobs[0]).toEqual({
      name: 'mock-service-idle',
      command: 'mock command',
      id: 'mocked-service-id',
      status: 'idle',
      lastRunAt: new Date('2025-05-01T14:00:00.000Z'),
    })
    expect(jobs[1]).toMatchObject({
      status: 'running',
    })
  })
})

describe('runJob', () => {
  it('deploys the specified service', async () => {
    await runJob('some-deploy-service-id')

    expect(deployService).toHaveBeenCalledWith('some-deploy-service-id')
  })
})
