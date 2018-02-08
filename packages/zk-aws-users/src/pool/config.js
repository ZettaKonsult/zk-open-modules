/* @flow */
/**
 * @date 2017-12-11
 */

import type { Attribute, Pool } from '../types';
import { Settings } from '../settings';
import { requiredAttributes } from '../settings';

export const clientConfiguration = (params: {
  client: string,
  pool: string,
}): { UserPoolId: string, ClientName: string } => {
  return {
    UserPoolId: `${params.pool}`,
    ClientName: `${params.client}`,
  };
};

export const groupConfiguration = (params: {
  pool: string,
  group: string,
  precedence: number,
  description: string,
}) => {
  let { description } = params;
  const { pool, group, precedence } = params;

  if (description == null) {
    description = '';
  }

  return {
    UserPoolId: `${pool}`,
    GroupName: `${group}`,
    Precedence: precedence,
    Description: `${description}`,
  };
};

export const poolConfiguration = (params: {
  pool: string,
  name: string,
  email: string,
}) => {
  const { pool, name, email } = params;

  return {
    PoolName: `${pool}`,
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: false,
      UnusedAccountValidityDays: 0,
      InviteMessageTemplate: {
        EmailMessage:
          `Welcome to ${name}, your username is {username} and ` +
          `your temporary password is {####}. `,
        EmailSubject: `Invitation to ${name}!`,
      },
    },
    AutoVerifiedAttributes: ['email'],
    EmailVerificationMessage: `Please click the link below to verify your email address.\n\n{####}.`,
    EmailVerificationSubject: `${name} signup verification.`,
    EmailConfiguration: {
      ReplyToEmailAddress: `${email}`,
    },
    Policies: {
      PasswordPolicy: {
        MinimumLength: 14,
      },
    },
    Schema: attributes({
      mutable: true,
      required: true,
      names: requiredAttributes(),
    }),
    VerificationMessageTemplate: {
      DefaultEmailOption: 'CONFIRM_WITH_LINK',
      EmailMessageByLink: `Please click the link below to verify your email address. {##Verify Email##}.`,
      EmailSubjectByLink: `${name} signup verification.`,
    },
  };
};

const attributes = (params: {
  mutable: boolean,
  required: boolean,
  names: Array<string>,
}): Array<Attribute> =>
  params.names.map((name: string) => {
    return {
      Mutable: params.mutable,
      Required: params.required,
      Name: name,
    };
  });
