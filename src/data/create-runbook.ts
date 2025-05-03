import { railway } from '@/lib/railway-client'
import { gql } from '@/lib/gql'
import { env } from '@/lib/env'

export const createRunbookService = async (slug: string, command: string) => {
  // create a new service for the runbook

  const createServiceMutation = gql`
    mutation CreateService(
      $name: String!
      $projectId: String!
      $environmentId: String!
      $repo: String!
    ) {
      serviceCreate(
        input: {
          name: $name
          projectId: $projectId
          environmentId: $environmentId
          source: { repo: $repo }
          variables: { RAILWAY_DOCKERFILE_PATH: "Dockerfile.executor" }
        }
      ) {
        id
      }
    }
  `

  type CreateServiceResponse = {
    serviceCreate: {
      id: string
    }
  }

  const createRes = await railway.request<
    CreateServiceResponse,
    { name: string; projectId: string; environmentId: string; repo: string }
  >(createServiceMutation, {
    name: `runbook-${slug}`,
    projectId: env.RAILWAY_PROJECT_ID,
    environmentId: env.RAILWAY_ENVIRONMENT_ID,
    repo: env.RUNBOOKS_REPO,
  })

  const createdServiceId = createRes.serviceCreate.id

  // now, update the build settings for the runbook

  const updateServiceMutation = gql`
    mutation UpdateService(
      $serviceId: String!
      $environmentId: String!
      $startCommand: String!
    ) {
      serviceInstanceUpdate(
        environmentId: $environmentId
        serviceId: $serviceId
        input: {
          restartPolicyType: NEVER
          startCommand: $startCommand
          builder: RAILPACK
          buildCommand: "echo nope"
        }
      )
    }
  `

  type UpdateServiceResponse = {
    serviceInstanceUpdate: boolean
  }

  const updateRes = await railway.request<
    UpdateServiceResponse,
    { serviceId: string; environmentId: string; startCommand: string }
  >(updateServiceMutation, {
    serviceId: createdServiceId,
    environmentId: env.RAILWAY_ENVIRONMENT_ID,
    startCommand: command,
  })

  if (!updateRes.serviceInstanceUpdate) {
    return { ok: false } as const
  }

  return { ok: true } as const
}
