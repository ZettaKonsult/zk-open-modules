/* @flow */

/**
 * @date 2017-12-12
 */

import util from 'util'
import type { Pool } from '../'
import AWS from 'aws-sdk'
import { poolName } from '.'
import { addConfig, getCognito } from '../'
import { groupConfiguration } from './config'
import { userPoolId } from './userPool'

addConfig(AWS.config)

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
    await (await getCognito())
      .adminAddUserToGroup({
        GroupName: groupName,
        UserPoolId: await userPoolId(names),
        Username: userName
      })
      .promise()
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
    if (await groupExists(names, groupName)) {
      console.log(`Group already exists.`)
      return groupName
    }
    poolId = await userPoolId(names)

    let result = await (await getCognito())
      .createGroup(
        groupConfiguration(poolId, groupName, precedence, description)
      )
      .promise()
    name = result.Group.GroupName
    console.log(`Successfully created group ${groupName} in pool ${poolId}.`)
    return name
  } catch (exception) {
    console.error(exception)
    return ''
  }
}

export const groupExists = async (
  names: Pool,
  groupName: string
): Promise<boolean> => (await listGroups(names)).indexOf(groupName) > -1

export const listGroups = async (names: Pool): { [string]: string } => {
  let params = {
    Limit: 50,
    UserPoolId: await userPoolId(names)
  }

  let groups = []
  let result = undefined

  do {
    try {
      result = (await (await getCognito()).listGroups(params).promise()).Groups
    } catch (exception) {
      console.error(exception)
      return
    }

    groups = result.reduce((groups, group) => {
      groups.push(group.GroupName)
      return groups
    }, [])

    params = {
      Limit: params.Limit,
      NextToken: result.NextToken
    }
  } while (result.nextToken)

  return groups
}
