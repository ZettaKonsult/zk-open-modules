/* @flow */

/**
 * @date 2017-12-14
 *
 * Use to manually test creation of a group.
 */

import util from 'util'
import { UserPool } from '../src'
import AWS from 'aws-sdk'
AWS.config.region = 'eu-central-1'

const CUSTOMER = 'TestCustomer'
const GROUP_NAME = 'Group'
const PROJECT = 'TestProject'

console.log(
  `Test parameters: ` +
    `\ncustomer: ${CUSTOMER}, ` +
    `\nproject: ${PROJECT}` +
    `\nname: ${GROUP_NAME}`
)

describe('Integration tests.', () => {
  it('Create group.', async () => {
    await UserPool.createGroup(
      {
        customer: `${CUSTOMER}`,
        project: `${PROJECT}`
      },
      `${GROUP_NAME}`
    )
  })
})
