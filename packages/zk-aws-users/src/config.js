/* @flow */
/**
 * @date 2017-12-21
 */

import AWS from 'aws-sdk'
import { settings } from './'
import util from 'util'

let configs = []
export const addConfig = async (awsConfig: {}) => {
  configs.push(awsConfig)
}

export const updateConfigs = async () => {
  for (let config of configs) {
    await setConfig(config)
  }
}

const setConfig = async (awsConfig: {
  credentials: { IdentityPoolId: string, RoleArn: string, AccountId: string },
  region: string
}) => {
  const mySettings = await settings()

  awsConfig.region = mySettings.Region
  awsConfig.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: mySettings.Identity.PoolId,
    RoleArn: mySettings.Identity.Arn.Authorized,
    AccountId: mySettings.AccountId
  })
}

let cognito
let iam

export const getCognito = async () => {
  if (cognito == null) {
    cognito = new AWS.CognitoIdentityServiceProvider()
  }
  return cognito
}
