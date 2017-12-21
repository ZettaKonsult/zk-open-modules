/* @flow */

/**
 * @date 2017-12-18
 */

export type { Policy, RolePolicy, Statement } from './types'
export {
  createPolicy,
  deletePolicy,
  getPolicyArn,
  listPolicies
} from './policy'
export { createRole, createAdminRole, deleteRole, getRoleArn } from './role'
