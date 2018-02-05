/* @flow */

import type { Pool, SignUpData } from '../types';
import UserPool from '../pool';
import { adminCreateConfig, adminConfig, signUpConfig } from './config';
import { getCognito } from '../config';

export const createAdminUser = async (params: {
  pool: string,
  attributes: { [string]: string },
}): Promise<string> => {
  const config = adminConfig();

  return await createUser({
    pool: params.pool,
    attributes: params.attributes,
    userName: config.userName,
    password: config.password,
  });
};

export const createUser = async (params: SignUpData): Promise<string> => {
  const { userName, pool } = params;
  console.log(`Admin-creating user ${userName}.`);

  try {
    if (await userExists(pool, userName)) {
      console.log(`User already exists.`);
      return userName;
    }

    const configuration = await adminCreateConfig(
      await UserPool.userPoolId({ pool }),
      params
    );
    let result = await getCognito()
      .adminCreateUser(configuration)
      .promise();

    let name = result.User.Username;
    console.log(`Successfully created user ${name}.`);
    return name;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const signUpAdminUser = async (params: {
  pool: string,
  attributes: { [string]: string },
}): Promise<string> => {
  const config = adminConfig();

  return await signUp({
    pool: params.pool,
    userName: config.userName,
    password: config.password,
    attributes: params.attributes,
  });
};

export const signUp = async (params: SignUpData): Promise<string> => {
  const { pool, userName } = params;
  console.log(`Signing up user ${userName}.`);

  try {
    if (await userExists({ pool, userName })) {
      console.log(`User already exists.`);
      return userName;
    }

    const configuration = await signUpConfig({
      clientId: await UserPool.clientId({ pool }),
      data: params,
    });

    await (await getCognito()).signUp(configuration).promise();
    console.log(`Successfully signed up user ${userName}.`);
    return userName;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const userExists = async (params: { pool: string, userName: string }) => {
  const { pool, userName } = params;
  const users = await listUsers({ pool });

  return (
    users.enabled.indexOf(userName) > -1 ||
    users.disabled.indexOf(userName) > -1
  );
};

export const isDisabled = async (params: {
  pool: string,
  userName: string,
}): boolean =>
  params.userName in (await listUsers({ pool: params.pool }))[false];

export const isEnabled = async (params: {
  pool: string,
  userName: string,
}): Promise<{ enabled: Array<string>, disabled: Array<string> }> =>
  params.userName in (await listUsers({ pool: params.pool }))[true];

export const listUsers = async (params: {
  pool: string,
}): { enabled: Array<string>, disabled: Array<string> } => {
  let awsParams = {
    UserPoolId: `${pool}`,
  };

  let disabled = [];
  let enabled = [];
  let result = {};

  do {
    try {
      result = (await (await getCognito()).listUsers(awsParams).promise())
        .Users;
    } catch (exception) {
      console.error(exception);
      return {};
    }

    result.reduce((users, user) => {
      let array = user.Enabled ? enabled : disabled;
      array.push(user.Username);
      return users;
    }, {});

    awsParams = {
      Limit: awsParams.Limit,
      NextToken: result.NextToken,
    };
  } while (result.nextToken);

  return { enabled: enabled, disabled: disabled };
};
