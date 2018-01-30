/* @flow */

/**
 * @date 2017-12-12
 */

import type { Pool } from '../types';
import { clientName, poolName } from './config';
import { userPoolId } from './userPool';
import { clientConfiguration } from './config';
import { getCognito } from '../config';

export const createClient = async (params: {
  names: Pool,
}): Promise<string> => {
  const pool = poolName(params);
  const client = clientName(params);
  console.log(`Creating application client ${client} for pool ${pool}.`);

  try {
    const poolId = await userPoolId(params);

    if (await clientExists(params)) {
      console.log(`Application client already exists.`);
      return '';
    }

    const result = await (await getCognito())
      .createUserPoolClient(
        clientConfiguration({ client: client, pool: poolId })
      )
      .promise();
    const clientId = result.UserPoolClient.ClientId;

    console.log(
      `Successfully created client ${client} (${clientId}) for pool ${pool} (${poolId}).`
    );
    return clientId;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const clientExists = async (params: { names: Pool }): Promise<boolean> =>
  (await clientId(params)) != null;

export const clientId = async (params: { names: Pool }): Promise<string> => {
  try {
    const client = clientName(params);
    const poolId = await userPoolId(params);

    let clientId = (await listClients({ userPoolId: poolId }))[client];
    return clientId;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const listClients = async (params: {
  userPoolId: string,
}): { [string]: string } => {
  const { userPoolId } = params;
  let awsParams = {
    UserPoolId: `${userPoolId}`,
    MaxResults: 50,
  };

  let clients = {};
  let result;

  do {
    try {
      result = (await (await getCognito())
        .listUserPoolClients(awsParams)
        .promise()).UserPoolClients;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }

    clients = result.reduce((clients, client) => {
      clients[client.ClientName] = client.ClientId;
      return clients;
    }, {});

    awsParams = {
      MaxResults: awsParams.MaxResults,
      NextToken: result.NextToken,
    };
  } while (result.nextToken);

  return clients;
};
