/* @flow */

/**
 * @date 2017-12-13
 */

import { Account } from '../src'
import { TestParameters } from './testUtil'

test('Confirm admin-created user.', async () => {
  await Account.loginSetFirstPassword({
    names: {
      project: TestParameters.ProjectName,
      customer: TestParameters.CustomerName
    },
    userName: TestParameters.AdminUser,
    password: TestParameters.Password,
    newPassword: TestParameters.NewPassword,
    attributes: {
      given_name: TestParameters.GivenName,
      family_name: TestParameters.FamilyName,
      address: TestParameters.Address,
      gender: TestParameters.Gender
    }
  })
})
