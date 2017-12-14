import { call } from './'
import { buildUpdateExpression, buildAttributeValues } from './queryBuilder'

export async function update({ TableName, Key, Values }) {
  const params = {
    TableName,
    Key,
    UpdateExpression: buildUpdateExpression(Values),
    ExpressionAttributeValues: buildAttributeValues(Values),
    ReturnValues: 'ALL_NEW'
  }
  try {
    return await call('update', params)
  } catch (e) {
    console.error(e)
  }
}
