/* @flow */

/**
 * @date 2017-12-14
 */

import type {
  LoginObject,
  LoginObjectFromUser,
  PasswordChallengeCompleter,
  Session,
} from '../types';
import { CognitoUser } from 'amazon-cognito-identity-js';
import util from 'util';

export const setNewPassword = (params: {
  user: CognitoUser,
  password: string,
  caller: LoginObject,
  attributes: { [string]: string },
}): PasswordChallengeCompleter => async () => {
  const { user, password, attributes, caller } = params;

  await user.completeNewPasswordChallenge(password, attributes, caller);
  console.log(`Set new password for ${user.username}.`);
};

export const loginSetFirstPasswordProcedure = (params: {
  newPassword: string,
  attributes: { [string]: string },
}): LoginObjectFromUser => {
  let procedure = loginProcedure();
  return user => {
    procedure.newPasswordRequired = setNewPassword({
      user: user,
      password: params.newPassword,
      caller: procedure,
      attributes: params.attributes,
    });
    return procedure;
  };
};

export const successfulLogin = (result: Object): Session => {
  console.log(
    `Successfully logged in user ${result.idToken.payload['cognito:username']}.`
  );
  const idToken = result.getIdToken();

  return {
    token: idToken.getJwtToken(),
    groups: idToken.payload['cognito:groups'],
  };
};

export const failedLogin = (error: Object) => {
  console.error(`Failed to log in user.`);
  throw error;
};

const multifactorLogin = (codeDeliveryDetails: Object) => {
  console.log(`Using multi-factor authentication.`);
  throw new Error('MFA is not yet implemented.');
};

export const loginProcedure = (): LoginObject => {
  return {
    onSuccess: successfulLogin,
    onFailure: failedLogin,
    mfaRequired: multifactorLogin,
    newPasswordRequired: () => {
      throw new Error(
        `loginProcess() should not be used to set a new password, ` +
          `use password#firstLoginProcess() instead. `
      );
    },
  };
};
