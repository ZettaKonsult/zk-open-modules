import { call } from './'
//make some change asas
export const create = async ({ TableName, Item }) => {
  const params = {
    TableName,
    Item
  }

  try {
    await call('put', params)
    return params.Item
  } catch (e) {
    throw new Error(e)
  }
}
