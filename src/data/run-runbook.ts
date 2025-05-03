import { railway } from '@/lib/railway-client'
import { gql } from '@/lib/gql'
import { env } from '@/lib/env'

export const runRunbookService = async (serviceId: string) => {
  // create a new service for the runbook

  const deployServiceMutation = gql`
    mutation DeployService($serviceId: String!, $environmentId: String!) {
      serviceInstanceDeployV2(
        environmentId: $environmentId
        serviceId: $serviceId
      )
    }
  `

  type DeployServiceResponse = {
    // returns the deployment ID, could be nice for streaming logs, updating status, etc
    serviceInstanceDeployV2: string
  }

  await railway.request<
    DeployServiceResponse,
    { environmentId: string; serviceId: string }
  >(deployServiceMutation, {
    environmentId: env.RAILWAY_ENVIRONMENT_ID,
    serviceId,
  })

  return { ok: true } as const
}
