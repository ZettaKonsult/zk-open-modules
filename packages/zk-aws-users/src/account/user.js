/* @flow */

/**
 * @date 2017-12-14
 */

import type { Pool } from '../types';
import { userPoolId } from '../pool/userPool';
import { clientId } from '../pool/client';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser,
} from 'amazon-cognito-identity-js';

type UserHandler = {
  pool: Pool,
  user: CognitoUser,
  details: AuthenticationDetails,
};

export const userHandler = async (params: {
  names: Pool,
  userName: string,
  password: string,
}): Promise<UserHandler> => {
  const { names, userName, password } = params;
  let handlerParams;
  try {
    handlerParams = {
      UserPoolId: await userPoolId({ names }),
      ClientId: await clientId({ names }),
    };
  } catch (exception) {
    console.error(exception);
    throw exception;
  }

  const pool = new CognitoUserPool(handlerParams);
  return {
    pool: pool,
    user: new CognitoUser({
      Username: userName,
      Pool: pool,
    }),
    details: new AuthenticationDetails({
      Username: userName,
      Password: password,
    }),
  };
};
