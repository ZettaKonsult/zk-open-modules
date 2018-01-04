/* @flow */
/**
 * @date 2017-12-21
 */

import AWS from 'aws-sdk'
import { Settings } from './'

let configs = []
export const addConfig = (awsConfig: AWS.config) => {
  configs.push(awsConfig)
}

export const updateConfigs = () => {
  for (let config of configs) {
    setConfig(config)
  }
}

const setConfig = (awsConfig: {
  credentials: { IdentityPoolId: string, RoleArn: string, AccountId: string },
  region: string
}) => {
  awsConfig.region = Settings.Region
  awsConfig.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: Settings.Identity.PoolId,
    RoleArn: Settings.Identity.Arn.Authorized,
    AccountId: Settings.AccountId,
    AccessKeyId: Settings.AccessKey
  })
}

let cognito

export const getCognito = async () => {
  if (cognito == null) {
    cognito = new AWS.CognitoIdentityServiceProvider()
  }
  return cognito
}
