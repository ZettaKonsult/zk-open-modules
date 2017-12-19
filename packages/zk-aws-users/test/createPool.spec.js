/* @flow */

/**
 * @date 2017-12-12
 *
 * Use to manually test creation of an user pool.
 */

import { UserPool } from '../src'

const CUSTOMER = 'TestCustomer'
const EMAIL = 'zmk.zk.dev@gmail.com'
const PROJECT = 'TestProject'

console.log(
  `Test parameters: ` +
    `customer: ${CUSTOMER}, ` +
    `email: ${EMAIL}, ` +
    `project: ${PROJECT}`
)

describe('Integration tests.', () => {
  it('Create pool.', () => {
    UserPool.createUserPool(
      {
        customer: `${CUSTOMER}`,
        project: `${PROJECT}`
      },
      EMAIL,
      {
        family_name: 'Kuhs',
        given_name: 'Zimon',
        birthdate: '9006211537',
        email: EMAIL
      }
    )
  })
})
