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

export const createUserPool = async (params: {
  names: string,
  replyEmail: string,
  adminAttributes: { [string]: string },
}): { [string]: Promise<string> } => {
  const { names, replyEmail, adminAttributes } = params;

  try {
    let result = {};
    result.pool = await createPool({ names, replyEmail });

    const args = { ...params, pool: result.pool }

    result.client = await createClient(args);
    result.domain = await createDomain(args);
    result.adminGroup = await createAdminGroup(args);
    result.administrator = await Account.signUpAdminUser({
      pool: pool,
      attributes: adminAttributes,
    });
    result.group = await assignUserToGroup({
      pool,
      group: result.adminGroup,
      user: result.administrator,
    });
    return result;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const createDomain = async (params: {
  pool: string
}): Promise<string> => {
  console.log(`Creating domain for ${pool}.`);

  try {
    const name = domainName(params);
    console.log(`Found name to be ${name}.`);
    await (await getCognito())
      .createUserPoolDomain({
        Domain: name,
        UserPoolId: pool,
      })
      .promise();
    console.log(`Successfully created domain ${name}.`);
    return name;
  } catch (exception) {
    if (exception.toString().includes('Domain already exists.')) {
      return '';
    }
    console.error(exception);
    throw exception;
  }
};

const createPool = async (params: {
  names: Pool,
  replyEmail: string,
}): Promise<boolean> => {
  const { names, replyEmail } = params;

  const name = poolName({ names });
  console.log(`Creating user pool ${name}.`);

  if (await userPoolExists({ pool })) {
    console.log(`Could not create pool ${name}, it already exists.`);
    return false;
  }

  try {
    await (await getCognito())
      .createUserPool(
        poolConfiguration({ pool, name, email: replyEmail })
      )
      .promise();
    console.log(`Successfully created user pool ${name}.`);
    return true;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const deleteDomain = async (params: {
  pool: string,
}): Promise<boolean> => {
  try {
    const name = domainName(params);

    const domainParams = {
      Domain: name,
      UserPoolId: pool,
    };

    await (await getCognito()).deleteUserPoolDomain(domainParams).promise();
    console.log(`Domain ${name} successfully deleted.`);
    return true;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const deleteUserPool = async (params: {
  pool: string,
}): Promise<boolean> => {
  console.log(`Deleting user pool ${pool}`);
  try {
    const awsParams = {
      UserPoolId: params.pool,
    };
    await (await getCognito()).deleteUserPool(awsParams).promise();
    console.log(`Pool successfully deleted.`);
    return true;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const userPoolExists = async (params: {
  pool: string,
}): Promise<boolean> => params.pool in (await listPools());

export const userPoolId = async (params: { names: Pool }): Promise<string> => {
  try {
    return (await listPools())[poolName(params)];
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
