/* @flow */

/**
 * @date 2017-12-14
 */

import type { Pool } from '../'
import { Settings, UserPool } from '../'
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser
} from 'amazon-cognito-identity-js'

import AWS from 'aws-sdk'
AWS.config.update({ region: Settings.Region })

type UserHandler = {
  pool: Pool,
  user: CognitoUser,
  details: AuthenticationDetails
}

export const userHandler = async (
  names: Pool,
  userName: string,
  password: string
): Promise<UserHandler> => {
  let params
  try {
    params = {
      UserPoolId: await UserPool.userPoolId(names),
      ClientId: await UserPool.clientId(names)
    }
  } catch (exception) {
    console.error(exception)
    throw exception
  }

  const pool = new CognitoUserPool(params)
  return {
    pool: pool,
    user: new CognitoUser({
      Username: userName,
      Pool: pool
    }),
    details: new AuthenticationDetails({
      Username: userName,
      Password: password
    })
  }
}
