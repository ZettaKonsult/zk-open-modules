/* @flow */

/**
 * @date 2017-12-14
 */

import { updateConfigs } from './config'

export const requiredAttributes = (): Array<string> => [
  'email',
  'birthdate',
  'family_name',
  'given_name'
]

export const Settings = {
  AccountId: '',
  Administrator: {
    PolicyName: 'administratorPolicy',
    RoleName: 'administratorRole'
  },
  Domain: {
    NameAttempts: 1000
  },
  Groups: {
    Administrator: {
      Name: 'Administrator',
      DefaultPassword: 'DefaultPasswordForAdmin'
    }
  },
  AccessKey: String(process.env.AWS_ACCESS_KEY_ID),
  Identity: {
    Arn: {
      Authorized: ''
    },
    PoolId: ''
  },
  Policy: {
    Version: '2012-10-17'
  },
  Region: 'eu-central-1',
  Separator: '-',
  Session: {
    ExpireTime: 60000
  }
}

export const settings = async (): Promise<{ [string]: any }> => Settings

export const setIdentity = async (
  accountId: number,
  poolId: string,
  authorizedArn: string
) => {
  Settings.AccountId = accountId
  Settings.Identity.PoolId = poolId
  Settings.Identity.Arn.Authorized = authorizedArn

  updateConfigs()
}
