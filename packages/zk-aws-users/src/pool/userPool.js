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
  names: Pool,
  replyEmail: string,
  adminAttributes: { [string]: string },
}): { [string]: Promise<string> } => {
  const { names, replyEmail, adminAttributes } = params;

  try {
    let result = {};
    result.pool = await createPool({ names, replyEmail });
    result.client = await createClient(params);
    result.domain = await createDomain(params);
    result.adminGroup = await createAdminGroup(params);
    result.administrator = await Account.signUpAdminUser({
      names: names,
      attributes: adminAttributes,
    });
    result.group = await assignUserToGroup({
      names,
      groupName: result.adminGroup,
      userName: result.administrator,
    });
    return result;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const createDomain = async (params: {
  names: Pool,
}): Promise<string> => {
  console.log(`Creating domain for ${poolName(params)}.`);

  try {
    const name = domainName(params);
    console.log(`Found name to be ${name}.`);
    await (await getCognito())
      .createUserPoolDomain({
        Domain: name,
        UserPoolId: await userPoolId(params),
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

const createPool = async (params: {
  names: Pool,
  replyEmail: string,
}): Promise<boolean> => {
  const { names, replyEmail } = params;

  const name = poolName({ names });
  console.log(`Creating user pool ${name}.`);

  if (await userPoolExists({ names })) {
    console.log(`Could not create pool ${name}, it already exists.`);
    return false;
  }

  try {
    await (await getCognito())
      .createUserPool(
        poolConfiguration({ poolId: name, name, email: replyEmail })
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
  names: Pool,
}): Promise<boolean> => {
  try {
    const name = domainName(params);
    const id = await userPoolId(params);

    if (id == null) {
      console.log(`Could not delete domain ${name}, no pool exists.`);
      return false;
    }
    console.log(`Domain ${name} belongs to user pool ${id}.`);

    const domainParams = {
      Domain: name,
      UserPoolId: id,
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
  names: Pool,
}): Promise<boolean> => {
  console.log(`Deleting user pool ${poolName(params)}`);
  try {
    const id = await userPoolId(params);
    if (id == null) {
      console.log(`Pool did not exist.`);
      return false;
    }
    console.log(`Using id ${id}.`);
    const awsParams = {
      UserPoolId: id,
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
  names: Pool,
}): Promise<boolean> => (await userPoolId(params)) != null;

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
