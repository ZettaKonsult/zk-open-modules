/* @flow */

/**
 * @date 2017-12-12
 */

import type { Pool } from '../types';
import { poolName } from './config';
import { getCognito } from '../config';
import { groupConfiguration } from './config';
import { userPoolId } from './userPool';

export const createAdminGroup = async (params: {
  names: {
    project: string,
    customer: string,
  },
}) =>
  await createGroup({
    names: params.names,
    groupName: 'Administrator',
    precedence: 0,
    description: 'Administrator group.',
  });

export const assignUserToGroup = async (params: {
  names: Pool,
  groupName: string,
  userName: string,
}): Promise<string> => {
  const { groupName, userName, names } = params;

  console.log(`Assigning user ${userName} to group ${groupName}.`);

  try {
    await (await getCognito())
      .adminAddUserToGroup({
        GroupName: groupName,
        UserPoolId: await userPoolId({ names }),
        Username: userName,
      })
      .promise();
  } catch (exception) {
    console.error(exception);
    throw exception;
  }

  console.log(`Successfully assigned user ${userName} to group ${groupName}.`);
  return userName;
};

export const createGroup = async (params: {
  names: {
    project: string,
    customer: string,
  },
  groupName: string,
  precedence: number,
  description: string,
}): Promise<string> => {
  let { precedence, description } = params;
  const { names, groupName } = params;

  description = description == null ? '' : description;
  precedence = precedence == null ? 0 : precedence;

  const pool = poolName(params);
  console.log(`Creating group ${groupName} for ${pool}`);

  let poolId;
  let name;
  try {
    if (await groupExists({ names, groupName })) {
      console.log(`Group already exists.`);
      return groupName;
    }
    poolId = await userPoolId(params);

    let result = await (await getCognito())
      .createGroup(
        groupConfiguration({
          userPoolId: poolId,
          groupName,
          precedence,
          description,
        })
      )
      .promise();
    name = result.Group.GroupName;
    console.log(`Successfully created group ${groupName} in pool ${poolId}.`);
    return name;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const groupExists = async (params: {
  names: Pool,
  groupName: string,
}): boolean => (await listGroups(params)).indexOf(params.groupName) > -1;

export const listGroups = async (params: {
  names: Pool,
}): { [string]: string } => {
  let awsParams = {
    Limit: 50,
    UserPoolId: await userPoolId(params),
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
