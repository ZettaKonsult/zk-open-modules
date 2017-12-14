import { call } from './'

export const remove = async ({ TableName, Key }) => {
  const params = {
    TableName,
    Key
  }

  try {
    await call('delete', params)
    return true
  } catch (e) {
    throw new Error(e)
  }
}
