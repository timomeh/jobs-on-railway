import { railway } from '@/lib/railway-client'
import { gql } from '@/lib/gql'
import { env } from '@/lib/env'

/**
 * Creates a new service for a runbook and configures it to act as a runbook.
 */
export const createRunbookService = async (slug: string, command: string) => {
  // Create a new service for the runbook,
  // connect it to the repo and specify a custom Dockerfile to run
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

  // Update the builds settings of the service:
  // - set restart policy to NEVER. it should only execute once.
  // - configure the custom start command. this is the command to run as runbook.
  // - set build command to a noop because no build task should be executed.
  //
  // TODO: "builder: RAILPACK" will automatically switch to dockerfile anyways,
  // check if it can be removed
  //
  // TODO: Should the runbook command be the `buildCommand` instead of the
  // `startCommand`? If the build can have access to other resources (should it?)
  // then it could be a build command! But would that work with Docker?
  // Using the `buildCommand` can improve how meaningful the DeploymentStatus is,
  // because it seems like the status doesn't reflect if a service exited.
  // It seems like "SUCCESS" will just mean that the service started, but
  // wouldn't reflect if the runbook succeeded.
  // If the runbook command is the buildCommand, "BUILDING" would mean that the
  // runbook is still being executed, and "SUCCESS" actually means success.
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
          buildCommand: "echo nothing"
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
