/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import { Account } from '../src'
import { TestParameters } from './testUtil'
import util from 'util'

test('Logging in user.', async () => {
  const pool = {
    customer: TestParameters.CustomerName,
    project: TestParameters.ProjectName
  }

  console.log(util.inspect(await Account.masterLogin()))
  await Account.masterSignOut()
  await Account.signOutUser({ names: pool })
  console.log(
    util.inspect(
      await Account.loginUser({
        names: pool,
        userName: TestParameters.AdminUser,
        password: TestParameters.NewPassword
      })
    )
  )
  await Account.signOutUser({ names: pool })
})
