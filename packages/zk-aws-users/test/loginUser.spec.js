/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import { Account } from '../src'
import util from 'util'
import AWS from 'aws-sdk'
AWS.config.region = 'eu-central-1'

const CUSTOMER = 'TestCustomer'
const PASSWORD = '8xz7mhYBGEqw1j'
const NEW_PASSWORD = 'abcdefghijklmnopqrstuvxyz'
const USER_NAME = 'Name'
const PROJECT = 'TestProject'

console.log(
  `Test parameters: ` +
    `\ncustomer: ${CUSTOMER}, ` +
    `\nproject: ${PROJECT}` +
    `\nname: ${USER_NAME}` +
    `\npassword: ${PASSWORD}, `
)

describe('Integration tests.', () => {
  it('Create account.', async () => {
    const pool = { customer: CUSTOMER, project: PROJECT }
    console.log(
      await Account.loginSetFirstPassword(
        pool,
        USER_NAME,
        PASSWORD,
        NEW_PASSWORD
      )
    )

    console.log(`Fetching current user.`)
    const user = await Account.currentUser({
      customer: CUSTOMER,
      project: PROJECT
    })
    console.log(util.inspect(user))

    console.log(await Account.signOutUser(pool))
  })
})
