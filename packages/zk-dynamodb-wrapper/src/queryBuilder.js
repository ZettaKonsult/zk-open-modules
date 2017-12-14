export const buildUpdateExpression = values =>
  `SET ${buildKeyConditionExpression(Object.keys(values))}`

export const buildAttributeValues = values =>
  Object.keys(values).reduce(
    (object, key) => ({
      ...object,
      [':' + key]: values[key]
    }),
    {}
  )

export const buildKeyConditionExpression = keys =>
  keys.map(key => `${key} = :${key}`).join(', ')
