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

export const loginSetFirstPasswordProcedure = (params: {
  newPassword: string,
  attributes: { [string]: string },
}): LoginObjectFromUser => {
  return user => {
    procedure.newPasswordRequired = passwordChallengeCompleter({
      user: user,
      password: params.newPassword,
      caller: loginProcedure(),
      attributes: params.attributes,
    });
    return procedure;
  };
};

const passwordChallengeCompleter = (params: {
  user: CognitoUser,
  password: string,
  caller: LoginObject,
  attributes: { [string]: string },
}): PasswordChallengeCompleter => async () => {
  const { user, password, attributes, caller } = params;

  await user.completeNewPasswordChallenge(password, attributes, caller);
  console.log(`Set new password for ${user.username}.`);
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
