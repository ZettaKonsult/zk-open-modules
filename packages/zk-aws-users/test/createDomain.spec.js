/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import { UserPool } from '../src'
import { TestParameters } from './testUtil'

test('Creating domain.', async () => {
  await UserPool.createDomain({
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName
  })
})
