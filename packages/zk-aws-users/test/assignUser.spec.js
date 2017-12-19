/* @flow */

/**
 * @date 2017-12-13
 *
 * Use to manually test creation of an user account.
 */

import { UserPool } from '../src'
import util from 'util'
import AWS from 'aws-sdk'
AWS.config.region = 'eu-central-1'

const CUSTOMER = 'TestCustomer'
const GROUP_NAME = 'Administrator'
const USER_NAME = 'Administrator'
const PROJECT = 'TestProject'

console.log(
  `Test parameters: ` +
    `\ncustomer: ${CUSTOMER}, ` +
    `\nproject: ${PROJECT}` +
    `\nname: ${USER_NAME}` +
    `\ngroup name: ${GROUP_NAME}, `
)

describe('Integration tests.', () => {
  it('Create account.', async () => {
    await UserPool.assignUserToGroup(
      {
        customer: CUSTOMER,
        project: PROJECT
      },
      GROUP_NAME,
      USER_NAME
    )
  })
})
