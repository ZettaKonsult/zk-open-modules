/* @flow */

/**
 * @date 2017-12-14
 *
 * Use to manually test creation of a group.
 */

import { UserPool } from '../src'
import { TestParameters } from './testUtil'

test('Creating group.', async () => {
  await UserPool.createGroup(
    {
      customer: `${TestParameters.CustomerName}`,
      project: `${TestParameters.ProjectName}`
    },
    `${TestParameters.AdminGroup}`
  )
})
