import { call } from './'

export const get = async ({ TableName, Key }) => {
  const params = {
    TableName,
    Key
  }

  try {
    const result = await call('get', params)
    if (result.Item) {
      return result.Item
    } else {
      return 'Item not found.'
    }
  } catch (e) {
    throw new Error(e)
  }
}
