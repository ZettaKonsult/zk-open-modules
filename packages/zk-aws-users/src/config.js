/* @flow */
/**
 * @date 2017-12-21
 */

import AWS from 'aws-sdk'

let cognito

export const getCognito = async () => {
  if (cognito == null) {
    cognito = new AWS.CognitoIdentityServiceProvider()
  }
  return cognito
}
