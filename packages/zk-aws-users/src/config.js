/* @flow */

export const requiredAttributes = (): Array<string> => [
  'email',
  'birthdate',
  'family_name',
  'given_name'
]

export const Settings = {
  AccountId: 0,
  Groups: {
    Administrator: {
      Name: 'Administrator',
      DefaultPassword: 'DefaultPasswordForAdmin'
    }
  },
  Id: String(process.env.AWS_ACCESS_KEY_ID),
  Identity: {
    Arn: {
      Unauthorized: ''
    },
    PoolId: ''
  },
  Policy: {
    Version: '2012-10-17'
  },
  Region: 'eu-central-1',
  Session: {
    ExpireTime: 60000
  }
}

export const setIdentity = (
  accountId: number,
  poolId: string,
  unauthorizedArn: string
) => {
  Settings.AccountId = accountId
  Settings.Identity.PoolId = poolId
  Settings.Identity.Arn.Unauthorized = unauthorizedArn
}
