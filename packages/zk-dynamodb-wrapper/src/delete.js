/* @flow */

import { call } from './';

export const remove = async (params: {
  TableName: string,
  Key: string,
}): Promise<boolean> => {
  try {
    await call('delete', params);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};
