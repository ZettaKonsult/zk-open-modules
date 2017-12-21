/* @flow */

/**
 * @date 2017-12-18
 */

import type { Policy } from './'
import type { Pool } from '../'
import { Settings } from '../'
import AWS from 'aws-sdk'
import { pathPrefix, policyName } from './config'

const IAM = new AWS.IAM()
const getIAM = async () => IAM

export const createPolicy = async (
  names: Pool,
  policy: Policy,
  suffix: string,
  description: string = ``
): Promise<{ [string]: string }> => {
  const name = policyName(names, suffix)
  const params = {
    PolicyDocument: JSON.stringify(policy),
    PolicyName: name,
    Description: description,
    Path: pathPrefix(names)
  }
  console.log(`Creating policy ${name}.`)

  try {
    const arn = await getPolicyArn(names, suffix)
    if (arn != null) {
      console.log(`Policy already existed.`)
      return {
        arn: arn,
        name: name
      }
    }

    const result = await (await getIAM()).createPolicy(params).promise()

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

export const deletePolicy = async (
  names: Pool,
  suffix: string
): Promise<boolean> => {
  try {
    console.log(`Deleting policy ${policyName(names, suffix)}.`)
    const arn = await getPolicyArn(names, suffix)
    if (arn == null) {
      console.log(`The policy does not exist.`)
      return false
    }

    const params = {
      PolicyArn: arn
    }

    await (await getIAM()).deletePolicy(params).promise()
    console.log(`Successfully deleted policy.`)
    return true
  } catch (exception) {
    console.error(exception)
    return false
  }
}

const policyExists = async (names: Pool, suffix: string) =>
  (await getPolicyArn(names, suffix)) != null

export const listPolicies = async (
  names: Pool,
  onlyAttached = false
): Promise<{ [string]: string }> => {
  let params = {
    OnlyAttached: onlyAttached,
    PathPrefix: pathPrefix(names),
    Scope: 'Local'
  }

  let policies = {}
  let result = undefined

  do {
    try {
      result = (await (await getIAM()).listPolicies(params).promise()).Policies
    } catch (exception) {
      console.error(exception)
      return {}
    }

    policies = result.reduce((policies, policy) => {
      policies[policy.PolicyName] = policy.Arn
      return policies
    }, {})

    params = {
      Marker: result.Marker
    }
  } while (result.IsTruncated)

  return policies
}

export const getPolicyArn = async (
  names: Pool,
  suffix: string
): Promise<string> => (await listPolicies(names))[policyName(names, suffix)]
