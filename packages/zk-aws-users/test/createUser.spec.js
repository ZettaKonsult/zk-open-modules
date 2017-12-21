/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import { Account } from '../src'
import { setupIdentity, TestParameters } from './testUtil'

test('Create account.', async () => {
  await setupIdentity()
  await Account.signUp({
    names: {
      customer: `${TestParameters.CustomerName}`,
      project: `${TestParameters.ProjectName}`
    },
    password: TestParameters.Password,
    userName: TestParameters.AdminUser,
    attributes: {
      family_name: TestParameters.FamilyName,
      given_name: TestParameters.GivenName,
      birthdate: TestParameters.SSN,
      email: TestParameters.Email
    }
  })
})
