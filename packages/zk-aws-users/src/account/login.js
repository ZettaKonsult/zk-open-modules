/* @flow */

/**
 * @date 2017-12-14
 */

import type {
  LoginObject,
  LoginObjectFromUser,
  PasswordChallengeCompleter
} from './'
import { CognitoUser } from 'amazon-cognito-identity-js'

export const setNewPassword = (
  user: CognitoUser,
  password: string,
  caller: LoginObject
): PasswordChallengeCompleter => (
  userAttributes: { [string]: string },
  requiredAttributes: { [string]: string }
) => {
  user.completeNewPasswordChallenge(password, userAttributes, caller)
  console.log(`Set new password for ${user.getUserName()}.`)
}

export const loginSetFirstPasswordProcedure = (
  newPassword: string
): LoginObjectFromUser => {
  let procedure = loginProcedure()
  return user => {
    procedure.newPasswordRequired = setNewPassword(user, newPassword, procedure)
    return procedure
  }
}

export const successfulLogin = (result: Object): string => {
  console.log(
    `Successfully logged in user ${result.idToken.payload['cognito:username']}.`
  )
  return result.getIdToken().getJwtToken()
}

export const failedLogin = (error: Object) => {
  console.error(`Failed to log in user.`)
  throw error
}

const multifactorLogin = (codeDeliveryDetails: Object) => {
  console.log(`Using multi-factor authentication.`)
  throw new Error('MFA is not yet implemented.')
}

export const loginProcedure = (): LoginObject => {
  return {
    onSuccess: successfulLogin,
    onFailure: failedLogin,
    mfaRequired: multifactorLogin,
    newPasswordRequired: () => {
      throw new Error(
        `loginProcess() should not be used to set a new password, ` +
          `use password#firstLoginProcess() instead. `
      )
    }
  }
}
