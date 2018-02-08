/* @flow */

/**
 * @date 2017-12-12
 */

import type { AdminCreateData, SignUpData } from '../types';
import { Settings, requiredAttributes } from '../settings';

type UserAttribute = {
  Name: string,
  Value: string,
};

export const setPassword = async (params: {
  user: CognitoUser,
  password: string,
  caller: LoginObject,
  attributes: { [string]: string },
}): PasswordChallengeCompleter => {
  const { user, password, attributes, caller } = params;

  await user.completeNewPasswordChallenge(password, attributes, caller);
  console.log(`Set new password for ${user.username}.`);
};

export const adminConfig = () => {
  return {
    name: Settings.Groups.Administrator.Name,
    password: Settings.Groups.Administrator.DefaultPassword,
  };
};

export const adminCreateConfig = (params: {
  userPoolId: string,
  data: AdminCreateData,
}) => {
  const { userPoolId, data } = params;

  return {
    UserPoolId: `${userPoolId}`,
    Username: `${data.userName}`,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: buildAttributes({ values: data.attributes }),
  };
};

export const signUpConfig = (params: SignUpData): {} => {
  const { client, user, password, attributes } = params;
  return {
    ClientId: `${client}`,
    Username: `${user}`,
    Password: `${password}`,
    UserAttributes: buildAttributes({ attributes }),
  };
};

const buildAttributes = (params: {
  attributes: { [string]: string },
}): Array<UserAttribute> =>
  requiredAttributes().map(attribute => {
    return { Name: attribute, Value: params.attributes[attribute] };
  });
