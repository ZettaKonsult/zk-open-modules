/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import { Account } from '../src'
import { setupIdentity, TestParameters } from './testUtil'

test('Test login of user.', async () => {
  await setupIdentity()
  const pool = {
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName
  }

  const token = await Account.loginUser(
    pool,
    TestParameters.AdminUser,
    TestParameters.Password
  )
})
