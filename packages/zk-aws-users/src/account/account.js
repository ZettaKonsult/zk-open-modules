/* @flow */

import type { SignUpData } from '.'
import type { Pool } from '../'
import AWS from 'aws-sdk'
import { adminCreateConfig, adminConfig, signUpConfig } from './config'
import { UserPool } from '../'
AWS.config.region = 'eu-central-1'
const AWSCognito = new AWS.CognitoIdentityServiceProvider()

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
    const configuration = await adminCreateConfig(
      await UserPool.userPoolId(data.names),
      data
    )
    let result = await AWSCognito.adminCreateUser(configuration).promise()

    let name = result.User.Username
    console.log(`Successfully created user ${name}.`)
    return name
  } catch (exception) {
    console.error(exception)
    return ''
  }
}

export const signUp = async (data: {
  names: Pool,
  password: string,
  userName: string,
  attributes: { [string]: string }
}) => {
  console.log(`Signing up user ${data.userName}.`)

  try {
    const configuration = await signUpConfig(
      await UserPool.clientId(data.names),
      data
    )
    let result = AWSCognito.signUp(configuration).promise()

    let name = result.User.Username
    console.log(`Successfully signed up user ${name}.`)
    return name
  } catch (exception) {
    console.error(exception)
    return
  }
}
