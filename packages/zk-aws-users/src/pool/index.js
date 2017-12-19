/* @flow */
/**
 * @date 2017-12-13
 */

export type { Attribute } from './types'
export { clientName, poolName } from './config'
export { createClient, clientId } from './client'
export { clientConfiguration, poolConfiguration } from './config'
export { assignUserToGroup, createGroup } from './group'
export {
  createUserPool,
  deleteUserPool,
  userPoolId,
  listPools
} from './userPool'
