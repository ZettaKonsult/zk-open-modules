/* @flow */

import { call } from './';

export const create = async (params: {
  TableName: string,
  Item: { [string]: string },
}): Promise<{ [string]: string }> => {
  try {
    await call({ action: 'put', params });
    return params.Item;
  } catch (e) {
    throw new Error(e);
  }
};
