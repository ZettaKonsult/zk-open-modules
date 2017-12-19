/* @flow */

import {
  CognitoUserAttribute,
  ICognitoUserAttributeData
} from 'amazon-cognito-identity-js'
import { getUserToken, authUser, getCurrentUser } from './session'

export const verifyAttribute = async () => {
  if (!await authUser()) {
    throw new Error(`User is not logged in.`)
  }

  const cognitoUser = getCurrentUser()
  getUserToken(cognitoUser)

  var verificationCode = prompt(`Please input verification code: `, ``)
  const result = cognitoUser.verifyAttribute('email', verificationCode, {
    onSuccess: result => console.log(result)
  })
  console.log(result)
}

export async function updateUserAttributes(
  attributesArray: Array<ICognitoUserAttributeData>
): Promise<string> {
  if (!await authUser()) {
    throw new Error(`User is not logged in.`)
  }

  const cognitoUser = getCurrentUser()
  getUserToken(cognitoUser)

  let attributeList = []
  attributesArray.map(attribute =>
    attributeList.push(new CognitoUserAttribute(attribute))
  )

  return new Promise((resolve, reject) => {
    cognitoUser.updateAttributes(attributeList, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

export const getAttributeVerificationCode = async () => {
  if (!await authUser()) {
    throw new Error(`User is not logged in.`)
  }

  const cognitoUser = getCurrentUser()
  getUserToken(cognitoUser)

  cognitoUser.getAttributeVerificationCode('email', {
    onSuccess: function(result) {
      console.log(`Call result: ${result}.`)
    },
    onFailure: function(err) {
      alert(err)
    },
    inputVerificationCode: null
  })
}

export async function getUserAttributes() {
  if (!await authUser()) {
    throw new Error(`User is not logged in.`)
  }

  const cognitoUser = getCurrentUser()
  getUserToken(cognitoUser)

  return new Promise((resolve, reject) =>
    cognitoUser.getUserAttributes(function(err, result) {
      if (err) {
        reject(err)
        return
      }

      resolve(result)
    })
  )
}
