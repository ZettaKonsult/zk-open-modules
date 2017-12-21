/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import { UserPool } from '../src'
import { setupIdentity, TestParameters } from './testUtil'

test('Integration tests.', async () => {
  await setupIdentity()
  await UserPool.assignUserToGroup(
    {
      customer: TestParameters.CustomerName,
      project: TestParameters.ProjectName
    },
    TestParameters.AdminGroup,
    TestParameters.AdminUser
  )
})
