/* @flow */

/**
 * @date 2017-12-12
 */

import type { Pool } from '../types';
import { poolName } from './config';
import { getCognito } from '../config';
import { groupConfiguration } from './config';
import { userPoolId } from './userPool';
import { Settings } from '../Settings';

export const createAdminGroup = async (params: {
  pool: string
}) =>
  await createGroup({
    names: params.pool,
    groupName: 'Administrator',
    precedence: 0,
    description: 'Administrator group.',
  });

export const assignUserToGroup = async (params: {
  pool: string,
  group: string,
  user: string,
}): Promise<string> => {
  const { group, user, pool } = params;

  console.log(`Assigning user ${user} to group ${group}.`);

  try {
    await (await getCognito())
      .adminAddUserToGroup({
        GroupName: group,
        UserPoolId: await userPoolId({ pool }),
        Username: user,
      })
      .promise();
  } catch (exception) {
    console.error(exception);
    throw exception;
  }

  console.log(`Successfully assigned user ${user} to group ${group}.`);
  return userName;
};

export const createGroup = async (params: {
  pool: string,
  group: string,
  precedence: number,
  description: string,
}): Promise<string> => {
  let { precedence, description } = params;
  const { pool, group } = params;

  description = description == null ? '' : description;
  precedence = precedence == null ? 0 : precedence;

  console.log(`Creating group ${group} for ${pool}`);

  let poolId;
  let name;
  try {
    if (await groupExists({ pool, group })) {
      console.log(`Group already exists.`);
      return group;
    }

    let result = await (await getCognito())
      .createGroup(
        groupConfiguration({
          pool,
          groupName,
          precedence,
          description,
        })
      )
      .promise();
    name = result.Group.GroupName;
    console.log(`Successfully created group ${group} in pool ${pool}.`);
    return name;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const groupExists = async (params: {
  pool: string,
  group: string,
}): boolean => (await listGroups(params)).indexOf(params.group) > -1;

export const listGroups = async (params: {
  pool: string,
}): { [string]: string } => {
  let awsParams = {
    Limit: 50,
    UserPoolId: pool,
  };

  let groups = [];
  let result = undefined;

  do {
    try {
      result = (await (await getCognito()).listGroups(awsParams).promise())
        .Groups;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }

    groups = result.reduce((groups, group) => {
      groups.push(group.GroupName);
      return groups;
    }, []);

    awsParams = {
      Limit: awsParams.Limit,
      NextToken: result.NextToken,
    };
  } while (result.nextToken);

  return groups;
};
