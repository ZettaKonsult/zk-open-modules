/* @flow */

import type { Pool } from '../'
import type { SignUpData } from './types'
import { Settings, UserPool } from '../'
import { adminCreateConfig, adminConfig, signUpConfig } from './config'
import { getCognito } from '../config'

import AWS from 'aws-sdk'
AWS.config.update({ region: Settings.Region })

export const createAdminUser = async (data: {
  names: Pool,
  attributes: {}
}): Promise<string> => {
  const config = adminConfig()

  return await createUser({
    names: data.names,
    attributes: data.attributes,
    userName: config.userName,
    password: config.password
  })
}

export const createUser = async (data: SignUpData): Promise<string> => {
  console.log(`Admin-creating user ${data.userName}.`)

  try {
    if (await userExists(data.names, data.userName)) {
      console.log(`User already exists.`)
      return data.userName
    }

    const configuration = await adminCreateConfig(
      await UserPool.userPoolId(data.names),
      data
    )
    let result = await getCognito()
      .adminCreateUser(configuration)
      .promise()

    let name = result.User.Username
    console.log(`Successfully created user ${name}.`)
    return name
  } catch (exception) {
    console.error(exception)
    throw exception
  }
}

export const signUpAdminUser = async (data: {
  names: Pool,
  attributes: {}
}): Promise<string> => {
  const config = adminConfig()

  return await signUp({
    names: data.names,
    userName: config.userName,
    password: config.password,
    attributes: data.attributes
  })
}

export const signUp = async (data: SignUpData): Promise<string> => {
  const name = data.userName
  console.log(`Signing up user ${name}.`)

  try {
    if (await userExists(data.names, name)) {
      console.log(`User already exists.`)
      return name
    }

    const configuration = await signUpConfig(
      await UserPool.clientId(data.names),
      data
    )

    await (await getCognito()).signUp(configuration).promise()
    console.log(`Successfully signed up user ${name}.`)
    return name
  } catch (exception) {
    console.error(exception)
    throw exception
  }
}

export const userExists = async (names: Pool, userName: string) => {
  const users = await listUsers(names)

  return (
    users.enabled.indexOf(userName) > -1 ||
    users.disabled.indexOf(userName) > -1
  )
}

export const isDisabled = async (names: Pool, userName: string) =>
  userName in (await listUsers(names))[false]

export const isEnabled = async (names: Pool, userName: string) =>
  userName in (await listUsers(names))[true]

export const listUsers = async (
  names: Pool
): { enabled: Array<string>, disabled: Array<string> } => {
  let params = {
    UserPoolId: `${await UserPool.userPoolId(names)}`
  }

  let disabled = []
  let enabled = []
  let result = {}

  do {
    try {
      result = (await (await getCognito()).listUsers(params).promise()).Users
    } catch (exception) {
      console.error(exception)
      return {}
    }

    let users = {}
    users = result.reduce((users, user) => {
      let array = user.Enabled ? enabled : disabled
      array.push(user.Username)
      return users
    }, {})

    params = {
      Limit: params.Limit,
      NextToken: result.NextToken
    }
  } while (result.nextToken)

  return { enabled: enabled, disabled: disabled }
}
