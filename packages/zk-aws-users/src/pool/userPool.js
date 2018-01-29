/* @flow */

/**
 * @date 2017-12-12
 */

import type { Pool } from '../types';
import { domainName, poolName } from './config';
import Account from '../account';
import { getCognito } from '../config';
import { createClient } from './client';
import { poolConfiguration } from './config';
import { assignUserToGroup, createAdminGroup } from './group';

export const createUserPool = async (
  names: Pool,
  replyEmail: string,
  attributes: {} = {}
): { [string]: Promise<string> } => {
  try {
    let result = {};
    result.pool = await createPool(names, replyEmail);
    result.client = await createClient(names);
    result.domain = await createDomain(names);
    result.group = await createAdminGroup(names);
    result.admin = await Account.signUpAdminUser({
      names: names,
      attributes: attributes,
    });
    result.group = await assignUserToGroup(names, result.group, result.admin);
    return result;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const createDomain = async (pool: Pool): Promise<string> => {
  console.log(`Creating domain for ${poolName(pool)}.`);

  try {
    const name = domainName(pool);
    console.log(`Found name to be ${name}.`);
    await (await getCognito())
      .createUserPoolDomain({
        Domain: name,
        UserPoolId: await userPoolId(pool),
      })
      .promise();
    console.log(`Successfully created domain ${name}.`);
    return name;
  } catch (exception) {
    if (exception.toString().includes('Domain already exists.')) {
      return '';
    }
    console.error(exception);
    return '';
  }
};

const createPool = async (
  names: Pool,
  replyEmail: string
): Promise<boolean> => {
  const name = poolName(names);
  console.log(`Creating user pool ${name}.`);

  if (await userPoolExists(names)) {
    console.log(`Could not create pool ${name}, it already exists.`);
    return false;
  }

  try {
    await (await getCognito())
      .createUserPool(poolConfiguration(name, name, replyEmail))
      .promise();
    console.log(`Successfully created user pool ${name}.`);
    return true;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const deleteDomain = async (names: Pool): Promise<boolean> => {
  try {
    const name = domainName(names);
    const id = await userPoolId(names);

    if (id == null) {
      console.log(`Could not delete domain ${name}, no pool exists.`);
      return false;
    }
    console.log(`Domain ${name} belongs to user pool ${id}.`);

    const params = {
      Domain: name,
      UserPoolId: id,
    };

    await (await getCognito()).deleteUserPoolDomain(params).promise();
    console.log(`Domain ${name} successfully deleted.`);
    return true;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const deleteUserPool = async (names: Pool): Promise<boolean> => {
  console.log(`Deleting user pool ${poolName(names)}`);
  try {
    const id = await userPoolId(names);
    if (id == null) {
      console.log(`Pool did not exist.`);
      return false;
    }
    console.log(`Using id ${id}.`);
    const params = {
      UserPoolId: id,
    };
    await (await getCognito()).deleteUserPool(params).promise();
    console.log(`Pool successfully deleted.`);
    return true;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const userPoolExists = async (names: Pool): Promise<boolean> =>
  (await userPoolId(names)) != null;

export const userPoolId = async (names: Pool): Promise<string> => {
  try {
    return (await listPools())[poolName(names)];
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const listPools = async (): { [string]: string } => {
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
      // console.error(exception);
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
