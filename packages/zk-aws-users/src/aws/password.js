/* @flow */

import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import { getUserToken, authUser, getCurrentUser } from './awslib'
import config from '../config'

export async function changePassword(oldPassword, newPassword) {
  if (!await authUser()) {
    throw new Error('User is not logged in')
  }

  const cognitoUser = getCurrentUser()
  getUserToken(cognitoUser)

  cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
    if (err) {
      console.log(err)
      return err
    }
    console.log('call result: ' + result)
  })
}

export const forgotPassword = userId => {
  const cognitoUserPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  })

  const cognitoUser = new CognitoUser({
    Username: userId,
    Pool: cognitoUserPool
  })

  cognitoUser.forgotPassword({
    onSuccess: function(result) {
      console.log('call result: ' + result)
    },
    onFailure: function(err) {
      alert(err)
    },
    inputVerificationCode() {
      var verificationCode = prompt('Please input verification code ', '')
      var newPassword = prompt('Enter new password ', '')
      cognitoUser.confirmPassword(verificationCode, newPassword, this)
    }
  })
}
