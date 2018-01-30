/* @flow */
/**
 * @date 2017-12-13
 */

import { clientName, domainName, poolName } from './config';
import { clientId, createClient } from './client';
import { assignUserToGroup, createGroup } from './group';
import {
  createDomain,
  createUserPool,
  deleteDomain,
  deleteUserPool,
  listPools,
  userPoolId,
} from './userPool';

export default {
  assignUserToGroup,
  clientId,
  clientName,
  createClient,
  createDomain,
  createGroup,
  createUserPool,
  deleteDomain,
  deleteUserPool,
  domainName,
  listPools,
  poolName,
  userPoolId,
};
