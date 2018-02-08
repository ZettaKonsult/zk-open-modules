/* @flow */

/**
 * @date 2017-12-14
 */

export const requiredAttributes = (): Array<string> => [
  'email',
  'birthdate',
  'family_name',
  'given_name',
];

export const Settings = {
  AccessKey: '',
  AccountId: '',
  Administrator: {
    PolicyName: 'administratorPolicy',
    RoleName: 'administratorRole',
  },
  Domain: {
    NameAttempts: 1000,
  },
  Groups: {
    Administrator: {
      Name: 'Administrator',
      DefaultPassword: 'DefaultPasswordForAdmin',
      Description: 'Administrator group.',
      Precedence: 0,
    },
  },
  Identity: {
    Arn: {
      Authorized: '',
      Unauthorized: '',
    },
    PoolId: '',
  },
  Policy: {
    Version: '2012-10-17',
  },
  Region: 'eu-central-1',
  Separator: '-',
  Session: {
    ExpireTime: 60000,
  },
};

export default (params: { config: { [string]: string } }) => {
  const { config } = params;
  Settings.AccessKey = config.AWS_ACCESS_KEY_ID;
  Settings.AccountId = config.AWS_ACCOUNT_ID;
  Settings.Identity.PoolId = config.AWS_IDENTITY_ID;
  Settings.Identity.Arn.Unauthorized = config.AWS_UNAUTH_ROLE_ARN;
  Settings.Identity.Arn.Authorized = config.AWS_AUTH_ROLE_ARN;
};
