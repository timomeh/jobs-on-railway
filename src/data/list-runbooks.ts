import { cache } from 'react'
import { railway } from '@/lib/railway-client'
import { gql } from '@/lib/gql'
import { env } from '@/lib/env'

export type DeploymentStatus =
  | 'BUILDING'
  | 'CRASHED'
  | 'DEPLOYING'
  | 'FAILED'
  | 'INITIALIZING'
  | 'NEEDS_APPROVAL'
  | 'QUEUED'
  | 'REMOVED'
  | 'REMOVING'
  | 'SKIPPED'
  | 'SLEEPING'
  | 'SUCCESS'
  | 'WAITING'

export const listRunbooks = cache(async () => {
  const query = gql`
    query GetEnvironment($id: String!) {
      environment(id: $id) {
        serviceInstances {
          edges {
            node {
              serviceName
              startCommand
              serviceId
              latestDeployment {
                status
              }
            }
          }
        }
      }
    }
  `

  type GetEnvironmentResponse = {
    environment: {
      serviceInstances: {
        edges: {
          node: {
            serviceName: string
            startCommand: string
            serviceId: string
            latestDeployment?: {
              status: DeploymentStatus
            }
          }
        }[]
      }
    }
  }

  const res = await railway.request<GetEnvironmentResponse, { id: string }>(
    query,
    {
      id: env.RAILWAY_ENVIRONMENT_ID,
    },
  )

  const runbookServices = res.environment.serviceInstances.edges
    .filter(({ node }) => node.serviceName.startsWith('runbook-'))
    .map(({ node }) => ({
      name: node.serviceName.replace(/^runbook-/, ''),
      command: node.startCommand,
      id: node.serviceId,
      status: node.latestDeployment?.status,
    }))

  return runbookServices
})
