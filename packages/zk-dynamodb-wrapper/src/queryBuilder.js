/* @flow */

export const buildUpdateExpression = (values: { [string]: string }) =>
  `SET ${buildKeyConditionExpression(Object.keys(values))}`;

export const buildAttributeValues = (values: { [string]: string }) =>
  Object.keys(values).reduce(
    (object, key) => ({
      ...object,
      [':' + key]: values[key],
    }),
    {}
  );

export const buildKeyConditionExpression = (keys: any) =>
  keys.map(key => `${key} = :${key}`).join(', ');
