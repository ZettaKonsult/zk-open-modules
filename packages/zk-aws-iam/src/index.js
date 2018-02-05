/* @flow */

/**
 * @date 2017-12-18
 */

import type { Policy, RolePolicy, Statement } from './types';
import {
  createPolicy,
  deletePolicy,
  getPolicyArn,
  listPolicies,
} from './policy';
import { createRole, createAdminRole, deleteRole, getRoleArn } from './role';

export default {
  Policy,
  RolePolicy,
  Statement,
  createPolicy,
  createRole,
  createAdminRole,
  deleteRole,
  deletePolicy,
  getPolicyArn,
  getRoleArn,
  listPolicies,
};
