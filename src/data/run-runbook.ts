import { railway } from '@/lib/railway-client'
import { gql } from '@/lib/gql'
import { env } from '@/lib/env'

/**
 * Runs a runbook service.
 */
export const runRunbookService = async (serviceId: string) => {
  // Trigger a new deployment. This effectively runs the runbook.
  const deployServiceMutation = gql`
    mutation DeployService($serviceId: String!, $environmentId: String!) {
      serviceInstanceDeployV2(
        environmentId: $environmentId
        serviceId: $serviceId
      )
    }
  `

  type DeploymentId = string
  type DeployServiceResponse = {
    // the returned DeploymentId could be nice for streaming logs, updating the progress, etc
    serviceInstanceDeployV2: DeploymentId
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
