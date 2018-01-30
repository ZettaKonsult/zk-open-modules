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

export const signUpConfig = (params: {
  clientId: string,
  data: SignUpData,
}): {} => {
  const { clientId, data } = params;

  return {
    ClientId: `${clientId}`,
    Username: `${data.userName}`,
    Password: `${data.password}`,
    UserAttributes: buildAttributes({ values: data.attributes }),
  };
};

const buildAttributes = (params: {
  values: { [string]: string },
}): Array<UserAttribute> =>
  requiredAttributes().map(attribute => {
    return { Name: attribute, Value: params.values[attribute] };
  });
