/* @flow */

/**
 * @date 2017-12-12
 *
 * Use to manually test creation of an user pool.
 */

import { UserPool } from '../src'
import { setupIdentity, TestParameters } from './testUtil'

test('Creating pool.', async () => {
  await setupIdentity()
  await UserPool.createUserPool(
    {
      customer: `${TestParameters.CustomerName}`,
      project: `${TestParameters.ProjectName}`
    },
    TestParameters.Email,
    {
      family_name: 'FamilyName',
      given_name: 'GivenName',
      birthdate: '0001011111',
      email: TestParameters.Email
    }
  )
})
