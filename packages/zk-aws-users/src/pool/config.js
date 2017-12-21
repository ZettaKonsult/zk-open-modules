/* @flow */
/**
 * @date 2017-12-11
 */

import type { Pool } from '../'
import type { Attribute } from './'
import { Settings, requiredAttributes } from '../'

const SEP = Settings.Separator

export const clientName = (names: Pool): string =>
  `${poolName(names)}${SEP}client`

export const domainName = (names: Pool) =>
  `${poolName(names).toLowerCase()}${SEP}domain`

export const poolName = (names: Pool): string =>
  `${names.project}${SEP}${names.customer}`

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
      AllowAdminCreateUserOnly: false,
      UnusedAccountValidityDays: 0,
      InviteMessageTemplate: {
        EmailMessage:
          `Welcome to ${name}, your username is {username} and ` +
          `your temporary password is {####}. `,
        EmailSubject: `Invitation to ${name}!`
      }
    },
    AutoVerifiedAttributes: ['email'],
    EmailVerificationMessage: `Please click the link below to verify your email address.\n\n{####}.`,
    EmailVerificationSubject: `${name} signup verification.`,
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
      EmailMessageByLink: `Please click the link below to verify your email address. {##Verify Email##}.`,
      EmailSubjectByLink: `${name} signup verification.`
    }
  }
}

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
