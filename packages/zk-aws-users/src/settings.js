/* @flow */

/**
 * @date 2017-12-14
 */

export const requiredAttributes = (): Array<string> => [
  'email',
  'birthdate',
  'family_name',
  'given_name'
]

export const Settings = {
  AccessKey: '',
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
  Identity: {
    Arn: {
      Authorized: '',
      Unauthorized: ''
    },
    PoolId: ''
  },
  Master: {
    Pool: {
      customer: '',
      project: ''
    },
    Password: '',
    UserName: ''
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

const env = process.env
Settings.AccessKey = env.AWS_ACCESS_KEY_ID
Settings.AccountId = env.AWS_ACCOUNT_ID
Settings.Master.UserName = env.AWS_MASTER_USER
Settings.Master.Password = env.AWS_MASTER_PASSWORD
Settings.Master.Pool.customer = env.AWS_MASTER_POOL_CUSTOMER
Settings.Master.Pool.project = env.AWS_MASTER_POOL_PROJECT
Settings.Identity.PoolId = env.AWS_IDENTITY_ID
Settings.Identity.Arn.Unauthorized = env.AWS_UNAUTH_ROLE_ARN
Settings.Identity.Arn.Authorized = env.AWS_AUTH_ROLE_ARN
