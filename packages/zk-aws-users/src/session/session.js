/* @flow */

/**
 * @date 2017-12-14
 */

import type { LoginObjectFromUser, Session } from '../types';
import {
  loginProcedure,
  loginSetFirstPasswordProcedure,
  failedLogin,
  successfulLogin,
} from './config';
import { userHandler } from './user';
import { getAWS } from '../config';
import { passwordSetter } from '../account/account';
import * as Client from '../pool/client';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

export const login = async (params: {
  pool: string,
  user: string,
  password: string,
}) =>
  await doLogin({
    pool: params.pool,
    user: params.user,
    attributes: {},
    password: params.password,
    login: loginProcedure,
  });

export const loginSetFirstPassword = async (params: {
  pool: string,
  user: string,
  attributes: { [string]: string },
  password: string,
  newPassword: string,
}): Promise<{ [string]: string }> =>
  await doLogin({
    pool: params.pool,
    user: params.user,
    password: params.password,
    login: loginSetFirstPasswordProcedure({
      newPassword: params.newPassword,
      attributes: params.attributes,
    }),
  });

const doLogin = async (params: {
  pool: string,
  user: string,
  password: string,
  login: LoginObjectFromUser,
}): Promise<Session> => {
  const { pool, user, password, login } = params;

  console.log(`Signing in user ${user} to pool ${pool}.`);

  try {
    const handler = await userHandler({ pool, user, password });
    let procedure = login(handler.user);

    return await new Promise((resolve, reject) => {
      procedure.onSuccess = result => resolve(successfulLogin(result));
      procedure.onFailure = error => reject(failedLogin(error));
      handler.user.authenticateUser(handler.details, procedure);
    })
      .then(result => result)
      .catch(exception => new Error(exception));
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const signOut = async (params: { pool: string }) => {
  const userObject = await getUser(params);

  if (userObject != null) {
    userObject.signOut();
    console.log(`Signed out user ${userObject.username}.`);
  }

  const AWS = getAWS();
  if (AWS.config.credentials) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({});
  }
};

export const getUser = async (params: {
  pool: string,
}): Promise<CognitoUser> => {
  const { pool } = params;

  return await new CognitoUserPool({
    UserPoolId: pool,
    ClientId: (await Client.getFirst(params)).id,
  }).getCurrentUser();
};

export const userToken = async (params: {
  user: CognitoUser,
}): Promise<string> => {
  const { user } = params;

  return await new Promise((resolve, reject) => {
    user.getSession(function(error, session) {
      if (error) {
        reject(error);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
};
