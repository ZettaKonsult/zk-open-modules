/* @flow */

/**
 * @date 2017-12-14
 */

import type { LoginObjectFromUser } from './'
import type { Pool } from '../'
import AWS from 'aws-sdk'
import {
  loginProcedure,
  loginSetFirstPasswordProcedure,
  failedLogin,
  successfulLogin
} from './login'
import { UserPool } from '../'
import { userHandler } from './user'
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

export const loginUser = async (
  names: Pool,
  userName: string,
  password: string
) => await doLogin(names, userName, password, loginProcedure)

export const loginSetFirstPassword = async (
  names: Pool,
  userName: string,
  password: string,
  newPassword: string
) => {
  await doLogin(
    names,
    userName,
    password,
    loginSetFirstPasswordProcedure(newPassword)
  )
}

const doLogin = async (
  names: Pool,
  userName: string,
  password: string,
  login: LoginObjectFromUser
) => {
  try {
    const handler = await userHandler(names, userName, password)
    const user = handler.user
    let procedure = login(user)

    return new Promise((resolve, reject) => {
      procedure.onSuccess = result => resolve(successfulLogin(result))
      procedure.onFailure = error => reject(failedLogin(error))
      handler.user.authenticateUser(handler.details, procedure)
    })
      .then(result => result)
      .catch(exception => new Error(exception))
  } catch (exception) {
    console.error(exception)
    return
  }
}

export const signOutUser = async (pool: Pool) => {
  const user = await currentUser(pool)

  if (user !== null) {
    user.signOut()
  }

  if (AWS.config.credentials) {
    AWS.config.credentials.clearCachedId()
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({})
  }
}

export const currentUser = async (names: Pool): Promise<CognitoUser> => {
  const userPool = new CognitoUserPool({
    UserPoolId: await UserPool.userPoolId(names),
    ClientId: await UserPool.clientId(names)
  })
  return await userPool.getCurrentUser()
}

export const userToken = async (currentUser: CognitoUser): Promise<string> => {
  return await new Promise((resolve, reject) => {
    currentUser.getSession(function(error, session) {
      if (error) {
        reject(error)
        return
      }
      resolve(session.getIdToken().getJwtToken())
    })
  })
}
