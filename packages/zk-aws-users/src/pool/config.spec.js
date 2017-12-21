/* @flow */
/**
 * @date  2017-12-11
 */

import { clientConfiguration, poolConfiguration } from './config'

describe('Basic tests.', () => {
  it('Pool configuration.', () => {
    expect(poolConfiguration('ID', 'NAME', 'EMAIL')).toEqual({
      PoolName: 'ID',
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true,
        InviteMessageTemplate: {
          EmailMessage:
            'Welcome to NAME, your username is {username} and your temporary password is {####} . ',
          EmailSubject: 'Invitation to NAME!'
        },
        UnusedAccountValidityDays: 0
      },
      EmailConfiguration: {
        ReplyToEmailAddress: 'EMAIL'
      },
      Policies: {
        PasswordPolicy: {
          MinimumLength: 14
        }
      },
      Schema: [
        {
          Mutable: true,
          Name: 'email',
          Required: true
        },
        {
          Mutable: true,
          Name: 'birthdate',
          Required: true
        },
        {
          Mutable: true,
          Name: 'family_name',
          Required: true
        },
        {
          Mutable: true,
          Name: 'given_name',
          Required: true
        }
      ],
      VerificationMessageTemplate: {
        DefaultEmailOption: 'CONFIRM_WITH_LINK',
        EmailMessageByLink:
          'Please click the link below to verify your' +
          ' email address. {##Verify Email##} .',
        EmailSubjectByLink: 'NAME signup verification.'
      }
    })
  })
  it('Client configuration.', () => {
    expect(
      clientConfiguration({
        client: 'Client',
        pool: 'Pool'
      })
    ).toEqual({
      ClientName: `Client`,
      UserPoolId: `Pool`
    })
  })
})
