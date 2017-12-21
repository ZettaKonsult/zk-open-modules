/* @flow */

/**
 * @date 2017-12-12
 */

import { setIdentity } from '../src'

const ACCOUNT_ID = '460056602695'
const IDENTITY_ID = 'eu-central-1:585f1bc3-2269-47bf-ae2f-354a6d2272e5'
const ROLE_ARN = 'arn:aws:iam::460056602695:role/Cognito_testAuth_Role'

export const TestParameters = {
  AdminGroup: 'AdministratorGroup',
  AdminUser: 'Administrator',
  CustomerName: 'TestCustomer',
  Email: 'zmk.zk.dev@gmail.com',
  FamilyName: 'FamilyName',
  GivenName: 'GivenName',
  Password: 'DefaultPasswordForAdmin',
  ProjectName: 'TestProject',
  SSN: '0001011111',
  UserGroup: 'UserGroup',
  UserName: 'User'
}

export const setupIdentity = async () =>
  await setIdentity(ACCOUNT_ID, IDENTITY_ID, ROLE_ARN)
