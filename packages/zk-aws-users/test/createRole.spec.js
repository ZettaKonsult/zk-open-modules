/* @flow */

/**
 * @date 2017-12-18
 */

import { Role } from '../src'
import { TestParameters } from './testUtil'

test('Creating role.', async () => {
  await Role.createAdminRole({
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName
  })
})
