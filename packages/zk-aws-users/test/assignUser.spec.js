/* @flow */

/**
 * @date 2017-12-13
 */

import { UserPool } from '../src'
import { TestParameters } from './testUtil'

test('Assign user to a group.', async () => {
  await UserPool.assignUserToGroup(
    {
      customer: TestParameters.CustomerName,
      project: TestParameters.ProjectName
    },
    TestParameters.AdminGroup,
    TestParameters.AdminUser
  )
})
