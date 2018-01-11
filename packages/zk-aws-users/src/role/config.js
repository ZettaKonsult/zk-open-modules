/* @flow */

/**
 * 2017-12-18
 */

import type { Pool } from '../'
import type { Policy, RolePolicy, RoleStatement } from './types'
import { Settings } from '../'

import AWS from 'aws-sdk'

const SEP = Settings.Separator

export const pathPrefix = (names: Pool): string =>
  `/${names.project}/${names.customer}/`

export const policyName = (names: Pool, suffix: string = ''): string =>
  `${names.project}${SEP}${names.customer}${SEP}${suffix}`

export const roleName = (names: Pool, suffix: string = ''): string =>
  `${names.project}${SEP}${names.customer}${SEP}${suffix}`

export const adminConfig = (): {
  name: string,
  groupPrecedence: number,
  policy: Policy,
  rolePolicy: RolePolicy
} => {
  return {
    name: Settings.Groups.Administrator.Name,
    groupPrecedence: 0,
    policy: adminPolicy(),
    rolePolicy: adminRolePolicy()
  }
}

export const policyConfig = (): { defaultName: string } => {
  return {
    defaultName: 'policy'
  }
}

export const adminPolicy = (): Policy => {
  return {
    Version: Settings.Policy.Version,
    Statement: [
      {
        Action: ['dynamodb:getItem'],
        Resource: [
          `arn:aws:dynamodb:${Settings.Region}:${
            Settings.Id
          }:table/MembrumOrders`
        ],
        Effect: 'Allow'
      }
    ]
  }
}

export const adminRolePolicy = (): RolePolicy => {
  return {
    Version: Settings.Policy.Version,
    Statement: buildStatements(Settings.Groups.Administrator.Name)
  }
}

let iam
export const getIAM = async (): AWS.IAM => {
  if (iam == null) {
    iam = new AWS.IAM()
  }
  return iam
}

const buildStatements = (userName: string): Array<RoleStatement> => {
  return statements().map(statement => {
    return {
      Action: statement.actions,
      Effect: 'Allow',
      Principal: {
        Federated: 'cognito-identity.amazonaws.com'
      }
    }
  })
}

const statements = (): Array<{
  actions: Array<string>
}> => {
  return [
    {
      actions: ['sts:AssumeRole']
    }
  ]
}
