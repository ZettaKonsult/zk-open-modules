/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import { Role, UserPool } from '../src'
import { setupIdentity, TestParameters } from './testUtil'
import { Settings } from '../src/settings'

test('Cleaning up after tests...', async () => {
  await setupIdentity()
  const names = {
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName
  }
  await UserPool.deleteDomain(names)
  await UserPool.deleteUserPool(names)
  await Role.deleteRole(
    names,
    Settings.Administrator.PolicyName,
    Settings.Administrator.RoleName
  )
  await Role.deletePolicy(names, Settings.Administrator.PolicyName)
})
