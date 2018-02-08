/* @flow */

/**
 * @date 2017-12-12
 */

import { getCognito, poolName } from '../config';
import { groupConfiguration } from './config';
import { Settings } from '../Settings';
import * as Pool from './pool';

export const createAdmin = async (params: { pool: string }) =>
  await create({
    pool: params.pool,
    group: Settings.Groups.Administrator.Name,
    precedence: Settings.Groups.Administrator.Precedence,
    description: Settings.Groups.Administrator.Description,
  });

export const assignUser = async (params: {
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
        UserPoolId: pool,
        Username: user,
      })
      .promise();
  } catch (exception) {
    console.error(exception);
    throw exception;
  }

  console.log(`Successfully assigned user ${user} to group ${group}.`);
  return user;
};

export const create = async (params: {
  pool: string,
  group: string,
  precedence: number,
  description: string,
}): Promise<string> => {
  let { precedence, description } = params;
  const { pool, group } = params;

  description = description == null ? '' : description;
  precedence = precedence == null ? 0 : precedence;

  console.log(`Creating group ${group} for pool ${pool}`);

  let poolId;
  let name;
  try {
    if (await exists({ pool, group })) {
      console.log(`Group ${group} already exists.`);
      return group;
    }

    let result = await (await getCognito())
      .createGroup(
        groupConfiguration({
          pool,
          group,
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

export const exists = async (params: {
  pool: string,
  group: string,
}): boolean => (await list(params)).indexOf(params.group) > -1;

export const list = async (params: { pool: string }): { [string]: string } => {
  const { pool } = params;

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
