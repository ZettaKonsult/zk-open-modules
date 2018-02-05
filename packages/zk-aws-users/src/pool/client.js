/* @flow */

/**
 * @date 2017-12-12
 */

import { clientName, poolName } from './config';
import { userPoolId } from './userPool';
import { clientConfiguration } from './config';
import { getCognito } from '../config';

export const createClient = async (params: {
  pool: string,
}): Promise<string> => {
  const client = clientName(params);
  console.log(`Creating application client ${name} for pool ${pool}.`);

  try {
    if (await clientExists(params)) {
      console.log(`Application client already exists.`);
      return '';
    }

    const result = await (await getCognito())
      .createUserPoolClient(
        clientConfiguration({ client, pool })
      )
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

export const clientExists = async (params: { pool: string }): Promise<boolean> =>
  (await clientId(params)) != null;

export const clientId = async (params: { pool: string }): Promise<string> => {
  try {
    const client = clientName(params);

    let clientId = (await listClients({ userPoolId: pool }))[client];
    return clientId;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const listClients = async (params: {
  pool: string,
}): { [string]: string } => {
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
