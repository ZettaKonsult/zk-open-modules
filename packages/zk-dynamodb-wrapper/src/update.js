/* @flow */

import { call } from './';
import { buildUpdateExpression, buildAttributeValues } from './queryBuilder';

export async function update(params: {
  TableName: string,
  Key: string,
  Values: { [string]: string },
}): Promise<void> {
  const { TableName, Key, Values } = params;
  const args = {
    TableName,
    Key,
    UpdateExpression: buildUpdateExpression(Values),
    ExpressionAttributeValues: buildAttributeValues(Values),
    ReturnValues: 'ALL_NEW',
  };
  try {
    return await call('update', args);
  } catch (e) {
    console.error(e);
  }
}
