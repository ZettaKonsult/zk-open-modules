/* @flow */
/**
 * @date 2017-12-13
 */

export type { Attribute } from './types'
export {
  clientName,
  domainName,
  poolName,
  clientConfiguration,
  poolConfiguration
} from './config'
export { createClient, clientId } from './client'
export { assignUserToGroup, createGroup } from './group'
export {
  createUserPool,
  createDomain,
  deleteDomain,
  deleteUserPool,
  userPoolId,
  listPools
} from './userPool'
