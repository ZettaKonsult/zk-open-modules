/* @flow */

/**
 * @date 2017-12-18
 */

import { Role } from '../src'
import util from 'util'
import AWS from 'aws-sdk'
AWS.config.region = 'eu-central-1'

const CUSTOMER = 'TestCustomer'
const PROJECT = 'TestProject'

console.log(`Test parameters: \ncustomer: ${CUSTOMER}, \nproject: ${PROJECT}`)

describe('Integration tests.', () => {
  it('Create account.', async () => {
    console.log(
      util.inspect(
        await Role.createAdminRole({
          customer: CUSTOMER,
          project: PROJECT
        })
      )
    )
  })
})
