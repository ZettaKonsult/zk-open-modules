/* @flow */

/**
 * @date 2017-12-12
 */

import type { Pool } from '../types';
import { getCognito, domainName, poolName } from '../config';
import { poolConfiguration } from './config';
import * as Account from '../account/account';
import * as Client from './client';
import * as Domain from './domain';
import * as Group from './group';

export const create = async (params: {
  names: string,
  replyEmail: string,
  adminAttributes: { [string]: string },
}): { [string]: Promise<string> } => {
  const { names, replyEmail, adminAttributes } = params;

  try {
    let result = {};
    result.pool = await doCreate({ names, replyEmail });

    let args = { ...params, pool: result.pool };

    result.client = await Client.create(args);
    result.domain = await Domain.create(args);
    result.adminGroup = await Group.createAdmin(args);
    result.administrator = await Account.signUpAdmin({
      ...args,
      attributes: adminAttributes,
    });

    args = { ...args, group: result.adminGroup, user: result.administrator };

    result.group = await Group.assignUser(args);
    return result;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

const doCreate = async (params: {
  names: Pool,
  replyEmail: string,
}): Promise<boolean> => {
  const { names, replyEmail } = params;

  const name = poolName({ names });
  console.log(`Creating user pool ${name}.`);

  const id = await getId({ names });
  if (id != null) {
    console.log(`Could not create pool called ${name}; it already exists.`);
    return id;
  }

  try {
    const id = (await (await getCognito())
      .createUserPool(
        poolConfiguration({ pool: name, name, email: replyEmail })
      )
      .promise()).UserPool.Id;
    console.log(`Successfully created user pool ${name} (${id}).`);
    return id;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const remove = async (params: { pool: string }): Promise<boolean> => {
  const { pool } = params;

  console.log(`Deleting user pool ${pool}.`);
  try {
    if (!await exists({ pool })) {
      console.log(`Could not delete pool called ${pool}; no such pool.`);
      return false;
    }

    const awsParams = {
      UserPoolId: pool,
    };
    await (await getCognito()).deleteUserPool(awsParams).promise();
    console.log(`Pool successfully deleted.`);
    return true;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const exists = async (params: { pool: string }): Promise<boolean> =>
  params.pool != null && Object.values(await list()).indexOf(params.pool) > -1;

export const nameExists = async (params: { names: Pool }): Promise<boolean> =>
  (await getId(params)) != null;

export const getId = async (params: { names: Pool }): Promise<string> => {
  try {
    return (await list())[poolName(params)];
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const list = async (): { [string]: string } => {
  let params = {
    MaxResults: 50,
  };

  let pools = {};
  let result = undefined;

  do {
    try {
      result = (await (await getCognito()).listUserPools(params).promise())
        .UserPools;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }

    pools = result.reduce((pools, pool) => {
      pools[pool.Name] = pool.Id;
      return pools;
    }, {});

    params = {
      MaxResults: params.MaxResults,
      NextToken: result.NextToken,
    };
  } while (result.nextToken);

  return pools;
};
