/* @flow */

/**
 * @date 2017-12-14
 */

import type { Pool } from '../types';
import { getAWS } from '../config';
import { Settings } from '../settings';
import { userPoolId } from '../pool/userPool';
import { clientId } from '../pool/client';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser
} from 'amazon-cognito-identity-js';

const AWS = getAWS();

type UserHandler = {
  pool: Pool,
  user: CognitoUser,
  details: AuthenticationDetails
};

export const userHandler = async (
  names: Pool,
  userName: string,
  password: string
): Promise<UserHandler> => {
  let params;
  try {
    params = {
      UserPoolId: await userPoolId(names),
      ClientId: await clientId(names)
    };
  } catch (exception) {
    console.error(exception);
    throw exception;
  }

  const pool = new CognitoUserPool(params);
  return {
    pool: pool,
    user: new CognitoUser({
      Username: userName,
      Pool: pool
    }),
    details: new AuthenticationDetails({
      Username: userName,
      Password: password
    })
  };
};
