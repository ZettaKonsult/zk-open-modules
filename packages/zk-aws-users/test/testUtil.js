/* @flow */

/**
 * @date 2017-12-12
 */

import { setIdentity } from '../src'

const ACCOUNT_ID = ''
const IDENTITY_ID = ''
const ROLE_ARN = ''

export const TestParameters = {
  AdminGroup: 'AdministratorGroup',
  AdminUser: 'Administrator',
  CustomerName: 'TestCustomer',
  Email: '',
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
