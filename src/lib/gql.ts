import { GraphQLClient, gql } from 'graphql-request'

export function createGraphqlClient(
  endpoint: string,
  { headers }: { headers: HeadersInit },
) {
  const client = new GraphQLClient(endpoint, {
    headers,
  })

  return client
}

export { gql }
