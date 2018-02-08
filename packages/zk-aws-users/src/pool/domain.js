/* @flow */

/**
 * @date 2018-02-06
 */

import { domainName, getCognito } from '../config';
import * as Pool from './pool';

export const create = async (params: { pool: string }): Promise<string> => {
  const { pool } = params;
  console.log(`Creating domain for ${pool}.`);

  try {
    const domain = domainName(params);
    console.log(`Found name to be ${domain}.`);

    if (await exists({ pool, domain })) {
      console.log(
        `Can not create domain ${domain} in pool ${pool}, it already exists.`
      );
      return '';
    }
    await (await getCognito())
      .createUserPoolDomain({
        Domain: domain,
        UserPoolId: pool,
      })
      .promise();
    console.log(`Successfully created domain ${domain}.`);
    return domain;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const remove = async (params: {
  pool: string,
  domain: string,
}): Promise<boolean> => {
  const { domain, pool } = params;

  try {
    if (!await Pool.exists({ pool })) {
      console.log(`Could not delete domain ${domain}; no such pool (${pool}).`);
      return false;
    }

    if (!await exists({ pool, domain })) {
      console.log(
        `Could not delete domain ${domain} in pool ${pool}; it does not exist).`
      );
      return false;
    }

    const domainParams = {
      Domain: domain,
      UserPoolId: pool,
    };

    await (await getCognito()).deleteUserPoolDomain(domainParams).promise();
    console.log(`Domain ${domain} successfully deleted.`);
    return true;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};

export const exists = async (params: {
  pool: string,
  domain: string,
}): Promise<boolean> =>
  params.domain != null && params.domain === (await get({ pool: params.pool }));

export const get = async (params: { pool: string }): Promise<string> => {
  try {
    if (!await Pool.exists(params)) {
      console.log(
        `Could not fetch domain of non-existent pool (${params.pool}).`
      );
      return undefined;
    }

    return (await (await getCognito())
      .describeUserPool({
        UserPoolId: params.pool,
      })
      .promise()).UserPool.Domain;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};
