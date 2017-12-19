/* @flow */

/**
 * @date 2017-12-15
 */

import type { Pool } from '../'
import { CognitoUser } from 'amazon-cognito-identity-js'

export type AdminCreateData = {
  userName: string,
  names: Pool,
  attributes: { [string]: string }
}

export type SignUpData = AdminCreateData & {
  password: string
}

export type PasswordChallengeCompleter = (
  userAttributes: { [string]: string },
  requiredAttributes: { [string]: string }
) => void

export type LoginObject = {
  onSuccess: (result: Object) => string | void,
  onFailure: (error: Object) => Object | void,
  mfaRequired: (codeDeliveryDetails: Object) => Object,
  newPasswordRequired: PasswordChallengeCompleter
}

export type LoginObjectFromUser = (user?: CognitoUser) => LoginObject
