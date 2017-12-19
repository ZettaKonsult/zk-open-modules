/* @flow */

export const requiredAttributes = (): Array<string> => [
  'email',
  'birthdate',
  'family_name',
  'given_name'
]

export const Settings = {
  Groups: {
    Administrator: {
      Name: 'Administrator',
      DefaultPassword: 'DefaultPasswordForAdmin'
    }
  },
  Id: String(process.env.AWS_ACCESS_KEY_ID),
  Policy: {
    Version: '2012-10-17'
  },
  Region: 'eu-central-1',
  Session: {
    ExpireTime: 60000
  }
}
