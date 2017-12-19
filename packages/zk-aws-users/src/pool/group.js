/* @flow */

/**
 * @date 2017-12-12
 */

import type { Pool } from '../'
import AWS from 'aws-sdk'
import { poolName } from '.'
import { groupConfiguration } from './config'
import { userPoolId } from './userPool'
AWS.config.region = 'eu-central-1'
const AWSCognito = new AWS.CognitoIdentityServiceProvider()

export const createAdminGroup = async (names: {
  project: string,
  customer: string
}) => await createGroup(names, 'Administrator', 0, 'Administrator group.')

export const assignUserToGroup = async (
  names: Pool,
  groupName: string,
  userName: string
): Promise<string> => {
  console.log(`Assigning user ${userName} to group ${groupName}.`)

  try {
    await AWSCognito.adminAddUserToGroup({
      GroupName: groupName,
      UserPoolId: await userPoolId(names),
      Username: userName
    }).promise()
  } catch (exception) {
    console.error(exception)
    return ''
  }

  console.log(`Successfully assigned user ${userName} to group ${groupName}.`)
  return userName
}

export const createGroup = async (
  names: {
    project: string,
    customer: string
  },
  groupName: string,
  precedence: number = 0,
  description: string = ''
): Promise<string> => {
  const pool = poolName(names)
  console.log(`Creating group ${groupName} for ${pool}`)

  let poolId
  let name
  try {
    poolId = await userPoolId(names)

    let result = await AWSCognito.createGroup(
      groupConfiguration(poolId, groupName, precedence, description)
    ).promise()
    name = result.Group.GroupName
  } catch (exception) {
    console.error(exception)
    return ''
  }

  console.log(`Successfully created group ${groupName} in pool ${poolId}.`)
  return name
}
