/* @flow */

import type { Pool, SignUpData } from '../types';
import UserPool from '../pool';
import { adminCreateConfig, adminConfig, signUpConfig } from './config';
import { getCognito } from '../config';

export const createAdminUser = async (params: {
  names: Pool,
  attributes: { [string]: string },
}): Promise<string> => {
  const config = adminConfig();

  return await createUser({
    names: params.names,
    attributes: params.attributes,
    userName: config.userName,
    password: config.password,
  });
};

export const createUser = async (params: SignUpData): Promise<string> => {
  const { userName, names } = params;
  console.log(`Admin-creating user ${userName}.`);

  try {
    if (await userExists(names, userName)) {
      console.log(`User already exists.`);
      return userName;
    }

    const configuration = await adminCreateConfig(
      await UserPool.userPoolId({ names: names }),
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
  names: Pool,
  attributes: { [string]: string },
}): Promise<string> => {
  const config = adminConfig();

  return await signUp({
    names: params.names,
    userName: config.userName,
    password: config.password,
    attributes: params.attributes,
  });
};

export const signUp = async (params: SignUpData): Promise<string> => {
  const { names, userName } = params;
  console.log(`Signing up user ${userName}.`);

  try {
    if (await userExists({ names, userName })) {
      console.log(`User already exists.`);
      return userName;
    }

    const configuration = await signUpConfig({
      clientId: await UserPool.clientId({ names }),
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

export const userExists = async (params: { names: Pool, userName: string }) => {
  const { names, userName } = params;
  const users = await listUsers({ names });

  return (
    users.enabled.indexOf(userName) > -1 ||
    users.disabled.indexOf(userName) > -1
  );
};

export const isDisabled = async (params: {
  names: Pool,
  userName: string,
}): boolean =>
  params.userName in (await listUsers({ names: params.names }))[false];

export const isEnabled = async (params: {
  names: Pool,
  userName: string,
}): Promise<{ enabled: Array<string>, disabled: Array<string> }> =>
  params.userName in (await listUsers({ names: params.names }))[true];

export const listUsers = async (params: {
  names: Pool,
}): { enabled: Array<string>, disabled: Array<string> } => {
  let awsParams = {
    UserPoolId: `${await UserPool.userPoolId(params)}`,
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
