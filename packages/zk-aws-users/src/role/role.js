/* @flow */

/**
 * @date 2017-12-18
 */

import type { RolePolicy } from './'
import type { Pool } from '../'
import { Settings } from '../'
import { getCognito } from '../config'
import { adminConfig, pathPrefix, policyName, roleName } from './config'
import { createPolicy, getPolicyArn } from './'
import { UserPool } from '../'
import AWS from 'aws-sdk'

const IAM = new AWS.IAM()
const getIAM = async () => IAM

import util from 'util'

export const createAdminRole = async (names: Pool) => {
  const config = adminConfig()
  const role = await createRole(
    names,
    config.rolePolicy,
    Settings.Administrator.RoleName
  )
  const policy = await createPolicy(
    names,
    config.policy,
    Settings.Administrator.PolicyName
  )
  await attachPolicy(role.name, policy.arn)
  await setGroupRole(names, config.name, config.groupPrecedence, role.arn)
  return role
}

export const attachPolicy = async (roleName: string, policyArn: string) => {
  console.log(`Attaching policy ${policyArn} to the role ${roleName}.`)

  try {
    await (await getIAM())
      .attachRolePolicy({
        PolicyArn: policyArn,
        RoleName: roleName
      })
      .promise()
    console.log(
      `Successfully attached policy ${policyArn} to the role ${roleName}.`
    )
  } catch (exception) {
    console.error(exception)
    return
  }
}

export const setGroupRole = async (
  names: Pool,
  groupName: string,
  precedence: number,
  roleArn: string,
  description: string = ''
) => {
  const params = {
    GroupName: groupName,
    UserPoolId: await UserPool.userPoolId(names),
    Description: description,
    Precedence: precedence,
    RoleArn: roleArn
  }

  console.log(
    `In pool ${UserPool.poolName(
      names
    )}, updating group ${groupName}'s role to ${roleArn}.`
  )
  try {
    await (await getCognito()).updateGroup(params).promise()
    console.log(`Successfully updated group ${groupName}.`)
  } catch (exception) {
    console.error(exception)
    return
  }
}

export const createRole = async (
  names: Pool,
  rolePolicy: RolePolicy,
  suffix: string
): Promise<{ [string]: string }> => {
  const name = roleName(names, suffix)
  console.log(`Creating role ${name}.`)

  try {
    const arn = await getRoleArn(names, suffix)
    if (arn != null) {
      console.log(`Role already exists.`)
      return {
        arn: arn,
        name: name
      }
    }

    const params = {
      AssumeRolePolicyDocument: `${JSON.stringify(rolePolicy)}`,
      Path: pathPrefix(names),
      RoleName: name
    }

    const result = await (await getIAM()).createRole(params).promise()
    console.log(`Successfully created role ${name}.`)

    return {
      arn: result.Role.Arn,
      name: result.Role.RoleName,
      id: result.Role.RoleId
    }
  } catch (exception) {
    console.error(exception)
    return {}
  }
}

export const deleteRole = async (
  names: Pool,
  policySuffix: string,
  roleSuffix: string
): Promise<boolean> => {
  const name = roleName(names, roleSuffix)
  console.log(`Deleting role ${name}`)

  try {
    if (!await roleExists(names, roleSuffix)) {
      console.log(`No such role.`)
      return false
    }

    const params = {
      RoleName: name
    }

    await detachAllPolicies(names, policySuffix, roleSuffix)
    await (await getIAM()).deleteRole(params).promise()
    return true
  } catch (exception) {
    console.error(exception)
    return false
  }
}

export const detachAllPolicies = async (
  names: Pool,
  policySuffix: string,
  roleSuffix: string
) => {
  const name = roleName(names, roleSuffix)
  console.log(`Detaching all policies from role ${name}.`)

  try {
    const arn = await getPolicyArn(names, policySuffix)

    const IAM = await console.log(
      `Detaching policy ${policyName(names, policySuffix)} from role ${name}.`
    )

    await (await getIAM())
      .detachRolePolicy({
        PolicyArn: `${arn}`,
        RoleName: `${name}`
      })
      .promise()
  } catch (exception) {
    throw exception
  }
}

export const listRolePolicies = async (
  names: Pool,
  suffix: string
): Promise<Array<string>> => {
  let params = {
    RoleName: roleName(names, suffix)
  }

  console.log(`PARAMS: ${util.inspect(params)}`)

  let policies = []
  let result = undefined

  do {
    try {
      result = await (await getIAM()).listRolePolicies(params).promise()
    } catch (exception) {
      console.error(exception)
      return []
    }

    console.log(`Got result ${util.inspect(result)}`)
    policies = [...policies, ...result]

    params = {
      RoleName: params.RoleName,
      Marker: result.Marker
    }
  } while (result.IsTruncated)

  return policies
}

const roleExists = async (names: Pool, suffix: string) =>
  (await getRoleArn(names, suffix)) != null

const getRoleArn = async (names: Pool, suffix: string): Promise<string> =>
  (await listRoles(names))[String(roleName(names, suffix))]

export const listRoles = async (names: Pool): Promise<{ [string]: string }> => {
  let params = {
    PathPrefix: pathPrefix(names)
  }

  let roles = {}
  let result = undefined

  do {
    try {
      result = (await (await getIAM()).listRoles(params).promise()).Roles
    } catch (exception) {
      console.error(exception)
      return {}
    }

    roles = result.reduce((roles, role) => {
      roles[role.RoleName] = role.Arn
      return roles
    }, {})

    params = {
      Marker: result.Marker
    }
  } while (result.IsTruncated)

  return roles
}
