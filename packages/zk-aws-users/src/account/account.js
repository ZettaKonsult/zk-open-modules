/* @flow */

/**
 * @date 2017-12-12
 */

import type { SignUpData } from '../types';
import { adminCreateConfig, adminConfig, signUpConfig } from './config';
import { getCognito } from '../config';
import * as Client from '../pool/client';

export const createAdmin = async (params: {
  pool: string,
  attributes: { [string]: string },
}): Promise<string> => {
  const config = adminConfig();

  return await create({
    pool: params.pool,
    attributes: params.attributes,
    user: config.user,
    password: config.password,
  });
};

export const create = async (params: SignUpData): Promise<string> => {
  const { user, pool } = params;
  console.log(`Admin-creating user ${user} in pool ${pool}.`);

  try {
    if (await exists(pool, user)) {
      console.log(`User ${user} already exists.`);
      return user;
    }

    const configuration = await adminCreateConfig(pool, params);
    let result = await getCognito()
      .adminCreateUser(configuration)
      .promise();

    let name = result.User.Username;
    console.log(`Successfully created user ${name} in pool ${pool}.`);
    return name;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const signUpAdmin = async (params: {
  pool: string,
  attributes: { [string]: string },
}): Promise<string> => {
  const config = adminConfig();

  return await signUp({
    pool: params.pool,
    user: config.name,
    password: config.password,
    attributes: params.attributes,
  });
};

export const signUp = async (params: SignUpData): Promise<string> => {
  const { pool, user } = params;
  let { client } = params;

  if (client == null) {
    let { id, name } = await Client.getFirst({ pool });
    client = id;

    console.info(
      `No client supplied for signing up, defaulting to ${name} (${client}).`
    );
  }

  console.log(`Signing up user ${user} in pool ${pool}, client ${client}.`);

  try {
    if (await exists({ pool, user })) {
      console.log(`User ${user} already exists in pool ${pool}.`);
      return user;
    }

    await (await getCognito())
      .signUp(signUpConfig({ ...params, client }))
      .promise();
    console.log(
      `Successfully signed up user ${user} in pool ${pool}, client ${client}.`
    );
    return user;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const exists = async (params: { pool: string, user: string }) => {
  const { pool, user } = params;
  const users = await list({ pool });

  return users.enabled.indexOf(user) > -1 || users.disabled.indexOf(user) > -1;
};

export const isDisabled = async (params: {
  pool: string,
  user: string,
}): boolean => params.userName in (await list({ pool: params.pool }))[false];

export const isEnabled = async (params: {
  pool: string,
  userName: string,
}): Promise<{ enabled: Array<string>, disabled: Array<string> }> =>
  params.userName in (await list({ pool: params.pool }))[true];

export const list = async (params: {
  pool: string,
}): { enabled: Array<string>, disabled: Array<string> } => {
  let awsParams = {
    UserPoolId: `${params.pool}`,
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
      throw exception;
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
