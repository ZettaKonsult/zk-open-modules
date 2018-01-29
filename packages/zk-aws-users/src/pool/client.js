/* @flow */

/**
 * @date 2017-12-12
 */

import type { Pool } from '../types';
import { clientName, poolName } from './config';
import { userPoolId } from './userPool';
import { clientConfiguration } from './config';
import { getCognito } from '../config';

export const createClient = async (names: Pool): Promise<string> => {
  const pool = poolName(names);
  const client = clientName(names);
  console.log(`Creating application client ${client} for pool ${pool}.`);

  try {
    const poolId = await userPoolId(names);

    if (await clientExists(names)) {
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

export const clientExists = async (names: Pool): Promise<boolean> =>
  (await clientId(names)) != null;

export const clientId = async (names: Pool): Promise<string> => {
  try {
    const client = clientName(names);
    const poolId = await userPoolId(names);

    let clientId = (await listClients(poolId))[client];
    return clientId;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const listClients = async (userPoolId: string): { [string]: string } => {
  let params = {
    UserPoolId: `${userPoolId}`,
    MaxResults: 50,
  };

  let clients = {};
  let result;

  do {
    try {
      result = (await (await getCognito())
        .listUserPoolClients(params)
        .promise()).UserPoolClients;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }

    clients = result.reduce((clients, client) => {
      clients[client.ClientName] = client.ClientId;
      return clients;
    }, {});

    params = {
      MaxResults: params.MaxResults,
      NextToken: result.NextToken,
    };
  } while (result.nextToken);

  return clients;
};
