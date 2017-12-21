/* @flow */

/**
 * @date 2017-12-18
 */

import { Role } from '../src'
import { setupIdentity, TestParameters } from './testUtil'

test('Integration tests.', async () => {
  await setupIdentity()
  await Role.createAdminRole({
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName
  })
})
