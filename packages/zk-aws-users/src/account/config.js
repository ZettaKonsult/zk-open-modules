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

export const adminConfig = () => {
  return {
    userName: Settings.Groups.Administrator.Name,
    password: Settings.Groups.Administrator.DefaultPassword,
  };
};

export const adminCreateConfig = (
  userPoolId: string,
  data: AdminCreateData
) => {
  return {
    UserPoolId: `${userPoolId}`,
    Username: `${data.userName}`,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: buildAttributes(data.attributes),
  };
};

export const signUpConfig = (clientId: string, data: SignUpData): {} => {
  return {
    ClientId: `${clientId}`,
    Username: `${data.userName}`,
    Password: `${data.password}`,
    UserAttributes: buildAttributes(data.attributes),
  };
};

const buildAttributes = (values: { [string]: string }): Array<UserAttribute> =>
  requiredAttributes().map(attribute => {
    return { Name: attribute, Value: values[attribute] };
  });
