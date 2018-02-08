/* @flow */

/**
 * @date 2017-12-14
 */

import type { UserHandler } from '../types';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import * as Client from '../pool/client';

export const userHandler = async (params: {
  pool: string,
  user: string,
  password: string,
}): Promise<UserHandler> => {
  const { pool, user, password } = params;
  let handlerParams;
  try {
    handlerParams = {
      UserPoolId: pool,
      ClientId: (await Client.getFirst({ pool })).id,
    };
  } catch (exception) {
    console.error(exception);
    throw exception;
  }

  const cognitoPool = new CognitoUserPool(handlerParams)

  return {
    pool: cognitoPool,
    user: new CognitoUser({
      Username: user,
      Pool: cognitoPool,
    }),
    details: new AuthenticationDetails({
      Username: user,
      Password: password,
    }),
  };
};
