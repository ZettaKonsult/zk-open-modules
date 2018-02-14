/* @flow */

import { call } from './';

export const get = async (params: {
  TableName: string,
  Key: string,
}): Promise<{ [string]: string } | string> => {
  try {
    const result = await call('get', params);
    if (result.Item) {
      return result.Item;
    } else {
      return 'Item not found.';
    }
  } catch (e) {
    throw new Error(e);
  }
};
