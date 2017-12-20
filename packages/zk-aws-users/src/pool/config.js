/* @flow */
/**
 * @date 2017-12-11
 */

import type { Attribute } from './'
import { requiredAttributes } from '../config'

const SEP = `-`

export const poolName = (names: {
  project: string,
  customer: string
}): string => `${names.project}${SEP}${names.customer}`

export const clientName = (names: {
  project: string,
  customer: string
}): string => `${poolName(names)}${SEP}client`

const stringAttributes = (
  mutable: boolean,
  required: boolean,
  names: Array<string>
): Array<Attribute> =>
  names.map((name: string) => {
    return {
      Mutable: mutable,
      Required: required,
      Name: name
    }
  })

export const clientConfiguration = (names: {
  client: string,
  pool: string
}): { UserPoolId: string, ClientName: string } => {
  return {
    UserPoolId: `${names.pool}`,
    ClientName: `${names.client}`
  }
}

export const groupConfiguration = (
  userPoolId: string,
  groupName: string,
  precedence: number,
  description: string = ''
) => {
  return {
    UserPoolId: `${userPoolId}`,
    GroupName: `${groupName}`,
    Precedence: precedence,
    Description: `${description}`
  }
}

export const poolConfiguration = (
  poolId: string,
  name: string,
  email: string
) => {
  return {
    PoolName: `${poolId}`,
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: true,
      UnusedAccountValidityDays: 0,
      InviteMessageTemplate: {
        EmailMessage:
          `Welcome to ${name}, your username is {username} and ` +
          `your temporary password is {####} . `,
        EmailSubject: `Invitation to ${name}!`
      }
    },

    EmailConfiguration: {
      ReplyToEmailAddress: `${email}`
    },
    Policies: {
      PasswordPolicy: {
        MinimumLength: 14
      }
    },
    Schema: stringAttributes(true, true, requiredAttributes()),
    VerificationMessageTemplate: {
      DefaultEmailOption: 'CONFIRM_WITH_LINK',
      EmailMessageByLink: `Please click the link below to verify your email address. {##Verify Email##} .`,
      EmailSubjectByLink: `${name} signup verification.`
    }
  }
}
