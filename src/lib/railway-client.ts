import { env } from './env'
import { createGraphqlClient } from './gql'

const endpoint = 'https://backboard.railway.com/graphql/v2'
const client = createGraphqlClient(endpoint, {
  headers: {
    authorization: `Bearer ${env.RAILWAY_API_TOKEN}`,
  },
})

export const railway = client
