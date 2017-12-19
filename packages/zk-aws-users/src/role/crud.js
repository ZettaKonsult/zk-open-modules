/* @flow */

/**
 * @date 2017-12-18
 */

import type { Policy, RolePolicy } from './'
import type { Pool } from '../'
import { Settings } from '../'
import { adminConfig, policyConfig } from './config'
import { UserPool } from '../'
import util from 'util'
import AWS from 'aws-sdk'
AWS.config.region = Settings.Region
const IAM = new AWS.IAM()

export const createAdminRole = async (names: Pool) => {
  const config = adminConfig()
  const role = await createRole(names, config.name, config.rolePolicy)
  const policy = await createPolicy(names, config.policy)
  await attachPolicy(role.name, policy.arn)
  await setGroupRole(names, config.name, config.groupPrecedence, role.arn)
  return role
}

const attachPolicy = async (roleName: string, policyArn: string) => {
  console.log(`Attaching policy ${policyArn} to the role ${roleName}.`)

  try {
    await IAM.attachRolePolicy({
      PolicyArn: policyArn,
      RoleName: roleName
    }).promise()
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
    await new AWS.CognitoIdentityServiceProvider().updateGroup(params).promise()
    console.log(`Successfully updated group ${groupName}.`)
  } catch (exception) {
    console.error(exception)
    return
  }
}

export const createRole = async (
  names: Pool,
  roleName: string,
  rolePolicy: RolePolicy,
  rolePath: string = '/'
): Promise<{ [string]: string }> => {
  try {
    const params = {
      AssumeRolePolicyDocument: `${JSON.stringify(rolePolicy)}`,
      Path: rolePath,
      RoleName: `${names.project}-${names.customer}-${roleName}`
    }

    console.log(`Creating role ${roleName}.`)
    const result = await IAM.createRole(params).promise()
    console.log(`Successfully created role ${roleName}.`)

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

export const createPolicy = async (
  names: Pool,
  policy: Policy,
  policyName: string = `${policyConfig().defaultName}`,
  description: string = ``,
  policyPath: string = `/`
): Promise<{ [string]: string }> => {
  const documentName = `${names.project}-${names.customer}-${policyName}`

  const params = {
    PolicyDocument: JSON.stringify(policy),
    PolicyName: documentName,
    Description: description,
    Path: policyPath
  }
  console.log(`Creating policy ${params.PolicyName}.`)

  try {
    const result = await IAM.createPolicy(params).promise()

    const policyArn = result.Policy.Arn
    const policyName = result.Policy.PolicyName

    console.log(`Created policy ${policyName} (${policyArn}).`)
    return {
      arn: policyArn,
      name: policyName
    }
  } catch (exception) {
    console.error(exception)
    return {}
  }
}
