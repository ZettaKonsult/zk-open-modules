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
} from './login';
import { getAWS } from '../config';
import UserPool from '../pool';
import { userHandler } from './user';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

export const loginUser = async (params: {
  pool: string,
  userName: string,
  password: string,
}) =>
  await doLogin({
    pool: params.pool,
    userName: params.userName,
    attributes: {},
    password: params.password,
    login: loginProcedure,
  });

export const loginSetFirstPassword = async (params: {
  pool: string,
  userName: string,
  attributes: { [string]: string },
  password: string,
  newPassword: string,
}) =>
  await doLogin({
    pool: params.pool,
    userName: params.userName,
    password: params.password,
    login: loginSetFirstPasswordProcedure({
      newPassword: params.newPassword,
      attributes: params.attributes,
    }),
  });

const doLogin = async (params: {
  pool: string,
  userName: string,
  password: string,
  login: LoginObjectFromUser,
}): Promise<Session> => {
  const { pool, userName, password, login } = params;

  try {
    const handler = await userHandler({ pool, userName, password });

    const user = handler.user;
    let procedure = login(user);

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

export const signOutUser = async (params: { pool: string }) => {
  const user = await currentUser(params);

  if (user !== null) {
    user.signOut();
    console.log(`Signed out user ${user.username}.`);
  }

  const AWS = getAWS();
  if (AWS.config.credentials) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({});
  }
};

export const currentUser = async (params: {
  pool: string,
}): Promise<CognitoUser> => {
  const { pool } = params;
  return await new CognitoUserPool({
    UserPoolId: pool,
    ClientId: await UserPool.clientId({pool}),
  }).getCurrentUser();
};

export const userToken = async (params: {
  currentUser: CognitoUser,
}): Promise<string> => {
  const { currentUser } = params;

  return await new Promise((resolve, reject) => {
    currentUser.getSession(function(error, session) {
      if (error) {
        reject(error);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
};
