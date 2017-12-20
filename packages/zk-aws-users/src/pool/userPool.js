/* @flow */

/**
 * @date 2017-12-12
 */

import type { Pool } from '../'
import AWS from 'aws-sdk'
import { Settings } from '../'
import { createClient } from './client'
import { poolName } from '.'
import { Account } from '../'
import { assignUserToGroup, createAdminGroup } from './group'
import * as Config from './config'

AWS.config.region = Settings.Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: Settings.Identity.PoolId,
  RoleArn: Settings.Identity.Arn.Unauthorized,
  AccountId: Settings.AccountId
})

let cognito

export const createUserPool = async (
  names: Pool,
  replyEmail: string,
  attributes: {} = {}
): { [string]: Promise<string> } => {
  try {
    let result = {}
    result.pool = await createPool(names, replyEmail)
    result.client = await createClient(names)
    result.group = await createAdminGroup(names)
    result.admin = await Account.createAdminUser({
      names: names,
      attributes: attributes
    })
    result.group = await assignUserToGroup(names, result.group, result.admin)
    return result
  } catch (exception) {
    console.error(exception)
    return
  }
}

const createPool = async (names: Pool, replyEmail: string): Promise<string> => {
  const name = poolName(names)
  console.log(`Creating user pool ${name}.`)

  if (await userPoolExists(names)) {
    throw new Error(`Can not create pool ${name}, it already exists.`)
  }

  try {
    await (await getCognito())
      .createUserPool(Config.poolConfiguration(name, name, replyEmail))
      .promise()
  } catch (exception) {
    console.error(exception)
    throw exception
  }

  console.log(`Successfully created user pool ${name}.`)
  return name
}

export const deleteUserPool = async (names: {
  customer: string,
  project: string
}) =>
  await (await getCognito())
    .deleteUserPool({
      UserPoolId: poolName(names)
    })
    .promise()

export const userPoolExists = async (names: {
  customer: string,
  project: string
}): Promise<boolean> => poolName(names) in (await listPools())

export const userPoolId = async (names: {
  customer: string,
  project: string
}): Promise<string> => {
  try {
    return (await listPools())[poolName(names)]
  } catch (exception) {
    console.error(exception)
    return ''
  }
}

export const listPools = async (): { [string]: string } => {
  let params = {
    MaxResults: 50
  }

  let pools = {}
  let result = undefined

  do {
    try {
      result = (await (await getCognito()).listUserPools(params).promise())
        .UserPools
    } catch (exception) {
      console.error(exception)
      return
    }

    pools = result.reduce((pools, pool) => {
      pools[pool.Name] = pool.Id
      return pools
    }, {})

    params = {
      MaxResults: params.MaxResults,
      NextToken: result.NextToken
    }
  } while (result.nextToken)

  return pools
}

const getCognito = async () => {
  if (cognito == null) {
    cognito = new AWS.CognitoIdentityServiceProvider()
  }
  return cognito
}
