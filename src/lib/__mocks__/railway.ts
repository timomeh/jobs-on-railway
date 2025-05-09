export const createService = vi.fn(async () => {
  return 'mocked-service-id'
})

export const updateService = vi.fn(async () => {
  return true
})

export const listServices = vi.fn(async () => {
  return [
    {
      serviceName: 'job-mock-service',
      startCommand: 'mock command',
      serviceId: 'mocked-service-id',
      latestDeployment: {
        status: 'SUCCESS',
        createdAt: '2025-05-01T14:00:00.000Z',
      },
    },
    {
      serviceName: 'job-mock-service-two',
      startCommand: 'mock command',
      serviceId: 'mocked-service-id-two',
      latestDeployment: {
        status: 'BUILDING',
        createdAt: '2025-05-01T14:00:00.000Z',
      },
    },
  ]
})

export const deployService = vi.fn(async () => {
  return 'mocked-deployment-id'
})
