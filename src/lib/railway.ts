import { GraphQLClient, gql } from 'graphql-request'
import { env } from './env'

const endpoint = 'https://backboard.railway.com/graphql/v2'
const rw = new GraphQLClient(endpoint, {
  headers: { authorization: `Bearer ${env.RAILWAY_API_TOKEN}` },
})

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

/**
 * Create a new railway service.
 */
export async function createService(createParams: {
  /** Name of the service in railway */
  name: string
  /** Path to the dockerfile to start the job */
  dockerfile: string
  /** Git repo in which the jobs are defined */
  repo: string
}) {
  const createServiceMutation = gql`
    mutation CreateService(
      $name: String!
      $projectId: String!
      $environmentId: String!
      $repo: String!
      $dockerfile: String!
    ) {
      serviceCreate(
        input: {
          name: $name
          projectId: $projectId
          environmentId: $environmentId
          source: { repo: $repo }
          variables: { RAILWAY_DOCKERFILE_PATH: $dockerfile }
        }
      ) {
        id
      }
    }
  `

  // TODO: Sets "builder: RAILPACK", but Railway will automatically update the
  // service anyways and switch it to a docker build anyways. Check if builder
  // can just be removed.

  // TODO: Check if the job command should be the `buildCommand` or the `startCommand`.
  // If the build can access to other resources, then it could be the build command.
  // - But does the build command work with Docker-based builds?
  // - If it's `buildCommand`, then the deployment status would reflect the
  //   job status better.

  type CreateServiceResponse = {
    serviceCreate: {
      id: string
    }
  }

  type CreateServiceInput = {
    name: string
    projectId: string
    environmentId: string
    repo: string
    dockerfile: string
  }

  const res = await rw.request<CreateServiceResponse, CreateServiceInput>(
    createServiceMutation,
    {
      projectId: env.RAILWAY_PROJECT_ID,
      environmentId: env.RAILWAY_ENVIRONMENT_ID,
      ...createParams,
    },
  )

  const createdServiceId = res.serviceCreate.id

  return createdServiceId
}

/**
 * Update the build settings of a railway service. Pre-configured for one-off jobs:
 * - sets restart policy to "never" to make it only run once.
 * - set build command to a noop because in Docker no build step is necessary.
 * - receives a custom start command to run the actual task.
 */
export async function updateService(
  serviceId: string,
  updateParams: {
    /** The job's actual command */
    startCommand: string
  },
) {
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

  type UpdateServiceInput = {
    serviceId: string
    environmentId: string
    startCommand: string
  }

  const updateRes = await rw.request<UpdateServiceResponse, UpdateServiceInput>(
    updateServiceMutation,
    {
      serviceId: serviceId,
      environmentId: env.RAILWAY_ENVIRONMENT_ID,
      ...updateParams,
    },
  )

  const hasUpdated = updateRes.serviceInstanceUpdate

  return hasUpdated
}

/**
 * List railways services.
 */
export async function listServices() {
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
                createdAt
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
              createdAt: string
            }
          }
        }[]
      }
    }
  }

  type GetEnvironmentInput = {
    id: string
  }

  const res = await rw.request<GetEnvironmentResponse, GetEnvironmentInput>(
    query,
    { id: env.RAILWAY_ENVIRONMENT_ID },
  )

  const services = res.environment.serviceInstances.edges.map(
    (edge) => edge.node,
  )

  return services
}

/**
 * Trigger a service deployment. This effectively runs a one-off job.
 */
export async function deployService(serviceId: string) {
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
  type DeployServiceInput = {
    environmentId: string
    serviceId: string
  }

  const res = await rw.request<DeployServiceResponse, DeployServiceInput>(
    deployServiceMutation,
    {
      environmentId: env.RAILWAY_ENVIRONMENT_ID,
      serviceId,
    },
  )

  const deploymentId = res.serviceInstanceDeployV2

  return deploymentId
}
