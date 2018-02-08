/* @flow */

/**
 * @date 2017-12-12
 */

import { clientName, poolName } from '../config';
import { clientConfiguration } from './config';
import { getCognito } from '../config';

export const create = async (params: { pool: string }): Promise<string> => {
  const { pool } = params;
  const client = clientName(params);
  console.log(`Creating application client ${client} for pool ${pool}.`);

  try {
    if (await exists(params)) {
      console.log(`Application client already exists.`);
      return '';
    }

    const result = await (await getCognito())
      .createUserPoolClient(clientConfiguration({ client, pool }))
      .promise();
    const id = result.UserPoolClient.ClientId;

    console.log(
      `Successfully created client ${client} (${id}) for pool ${pool}.`
    );
    return id;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const exists = async (params: { pool: string }): Promise<boolean> =>
  (await clientId(params)) != null;

export const clientId = async (params: { pool: string }): Promise<string> => {
  const { pool } = params;
  try {
    const client = clientName(params);

    let clientId = (await list({ pool }))[client];
    return clientId;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const getFirst = async (params: {
  pool: string,
}): Promise<{ name: string, id: string }> => {
  try {
    const clients = await list(params);
    const name = Object.keys(clients)[0];
    return { name, id: clients[name] };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const list = async (params: { pool: string }): { [string]: string } => {
  const { pool } = params;
  let awsParams = {
    UserPoolId: `${pool}`,
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
