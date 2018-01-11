/* @flow */

/**
 * @date 2017-12-14
 */

import util from 'util'
import type { LoginObjectFromUser } from './'
import type { Pool } from '../'
import AWS from 'aws-sdk'
import {
  loginProcedure,
  loginSetFirstPasswordProcedure,
  failedLogin,
  successfulLogin
} from './login'
import { Settings, UserPool } from '../'
import { userHandler } from './user'
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

export const masterLogin = async () =>
  await loginUser({
    names: Settings.Master.Pool,
    userName: Settings.Master.UserName,
    password: Settings.Master.Password
  })

export const masterSignOut = async () =>
  await signOutUser({
    names: Settings.Master.Pool
  })

export const loginUser = async (params: {
  names: Pool,
  userName: string,
  password: string
}) =>
  await doLogin({
    names: params.names,
    userName: params.userName,
    attributes: {},
    password: params.password,
    login: loginProcedure
  })

export const loginSetFirstPassword = async (params: {
  names: Pool,
  userName: string,
  attributes: { [string]: string },
  password: string,
  newPassword: string
}) =>
  await doLogin({
    names: params.names,
    userName: params.userName,
    password: params.password,
    login: loginSetFirstPasswordProcedure({
      newPassword: params.newPassword,
      attributes: params.attributes
    })
  })

const doLogin = async (params: {
  names: Pool,
  userName: string,
  password: string,
  login: LoginObjectFromUser
}): Promise<string> => {
  const { names, userName, password, login } = params

  try {
    const handler = await userHandler(names, userName, password)

    const user = handler.user
    let procedure = login(user)

    return await new Promise((resolve, reject) => {
      procedure.onSuccess = result => resolve(successfulLogin(result))
      procedure.onFailure = error => reject(failedLogin(error))
      handler.user.authenticateUser(handler.details, procedure)
    })
      .then(result => result)
      .catch(exception => new Error(exception))
  } catch (exception) {
    console.error(exception)
    throw exception
  }
}

export const signOutUser = async (params: { names: Pool }) => {
  const { names } = params
  const user = await currentUser(names)

  if (user !== null) {
    user.signOut()
    console.log(`Signed out user ${user.username}.`)
  }

  if (AWS.config.credentials) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({})
  }
}

export const currentUser = async (names: Pool): Promise<CognitoUser> => {
  const user = await new CognitoUserPool({
    UserPoolId: await UserPool.userPoolId(names),
    ClientId: await UserPool.clientId(names)
  }).getCurrentUser()
  return user
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
