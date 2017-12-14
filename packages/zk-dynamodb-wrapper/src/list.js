import { call } from './'
import {
  buildKeyConditionExpression,
  buildAttributeValues
} from './queryBuilder'

export const list = async ({ TableName, Values }) => {
  const params = {
    TableName,
    KeyConditionExpression: buildKeyConditionExpression(Object.keys(Values)),
    ExpressionAttributeValues: buildAttributeValues(Values)
  }

  try {
    const result = await call('query', params)
    if (result.Items) {
      return result.Items
    } else {
      return 'No Items Found'
    }
  } catch (e) {
    console.error(e)
  }
}
