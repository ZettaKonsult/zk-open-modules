/* @flow */

import { call } from './';
import {
  buildKeyConditionExpression,
  buildAttributeValues,
} from './queryBuilder';

export const list = async (params: {
  TableName: string,
  Values: { [string]: string },
}): Promise<{ [string]: string } | string> => {
  const { TableName, Values } = params;
  const args = {
    TableName,
    KeyConditionExpression: buildKeyConditionExpression(Object.keys(Values)),
    ExpressionAttributeValues: buildAttributeValues(Values),
  };

  try {
    const result = await call('query', args);
    if (result.Items) {
      return result.Items;
    } else {
      return 'No Items Found';
    }
  } catch (e) {
    console.error(e);
    return 'No Items Found';
  }
};
