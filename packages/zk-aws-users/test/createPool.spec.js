/* @flow */

/**
 * @date 2017-12-12
 */

import { UserPool } from '../src'
import { TestParameters } from './testUtil'

test('Creating pool.', async () => {
  await UserPool.createUserPool(
    {
      customer: `${TestParameters.CustomerName}`,
      project: `${TestParameters.ProjectName}`
    },
    TestParameters.Email,
    {
      family_name: TestParameters.FamilyName,
      given_name: TestParameters.GivenName,
      birthdate: TestParameters.SSN,
      email: TestParameters.Email
    }
  )
})
