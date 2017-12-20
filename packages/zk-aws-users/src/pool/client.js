/* @flow */

/**
 * @date 2017-12-12
 */

import type { Pool } from '../'
import AWS from 'aws-sdk'
import { Settings } from '../'
import { userPoolId, clientName, poolName } from '.'
import { clientConfiguration } from './config'

AWS.config.region = 'eu-central-1'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: Settings.Identity.PoolId,
  RoleArn: Settings.Identity.Arn.Unauthorized,
  AccountId: Settings.AccountId
})

let cognito

export const createClient = async (names: Pool) => {
  const pool = poolName(names)
  const client = clientName(names)
  console.log(`Creating application client ${client} for pool ${pool}.`)

  try {
    const poolId = await userPoolId(names)
    const result = await (await getCognito())
      .createUserPoolClient(
        clientConfiguration({ client: client, pool: poolId })
      )
      .promise()
    const clientId = result.UserPoolClient.ClientId

    console.log(
      `Successfully created client ${client} (${clientId}) for pool ${pool} (${poolId}).`
    )
  } catch (exception) {
    console.error(exception)
    return
  }
}

export const clientId = async (names: Pool): Promise<string> => {
  try {
    const client = clientName(names)
    const poolId = await userPoolId(names)

    let clientId = (await listClients(poolId))[client]
    return clientId
  } catch (exception) {
    console.error(exception)
    return ''
  }
}

export const listClients = async (userPoolId: string): { [string]: string } => {
  console.log(`Listing clients for ${userPoolId}.`)
  let params = {
    UserPoolId: `${userPoolId}`,
    MaxResults: 50
  }

  let clients = {}
  let result = undefined

  do {
    try {
      result = (await (await getCognito())
        .listUserPoolClients(params)
        .promise()).UserPoolClients
    } catch (exception) {
      console.error(exception)
      return []
    }

    clients = result.reduce((clients, client) => {
      clients[client.ClientName] = client.ClientId
      return clients
    }, {})

    params = {
      MaxResults: params.MaxResults,
      NextToken: result.NextToken
    }
  } while (result.nextToken)

  return clients
}

const getCognito = async () => {
  if (cognito == null) {
    cognito = new AWS.CognitoIdentityServiceProvider()
  }
  return cognito
}
