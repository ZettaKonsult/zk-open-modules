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
const EMAIL = 'zmk.zk.dev@gmail.com'
const PASSWORD = 'Passw0rdPassw0rd'
const USER_NAME = 'Name'
const PROJECT = 'TestProject'

console.log(
  `Test parameters: ` +
    `\ncustomer: ${CUSTOMER}, ` +
    `\nproject: ${PROJECT}` +
    `\nname: ${USER_NAME}` +
    `\nemail: ${EMAIL}, `
)

describe('Integration tests.', () => {
  it('Create account.', async () => {
    console.log(
      util.inspect(
        await Account.createUser({
          names: {
            customer: `${CUSTOMER}`,
            project: `${PROJECT}`
          },
          password: PASSWORD,
          userName: USER_NAME,
          attributes: {
            family_name: 'Kuhs',
            given_name: 'Zimon',
            birthdate: '9006211537',
            email: EMAIL
          }
        })
      )
    )
  })
})
