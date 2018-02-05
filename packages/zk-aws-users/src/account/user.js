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
  pool: string,
  userName: string,
  password: string,
}): Promise<UserHandler> => {
  const { pool, userName, password } = params;
  let handlerParams;
  try {
    handlerParams = {
      UserPoolId: pool,
      ClientId: await clientId({ pool }),
    };
  } catch (exception) {
    console.error(exception);
    throw exception;
  }

  const cognitoPool = new CognitoUserPool(handlerParams);
  return {
    pool: cognitoPool,
    user: new CognitoUser({
      Username: userName,
      Pool: cognitoPool,
    }),
    details: new AuthenticationDetails({
      Username: userName,
      Password: password,
    }),
  };
};
