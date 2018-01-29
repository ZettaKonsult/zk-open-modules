/* @flow */
/**
 * @date 2017-12-13
 */

import {
  clientName,
  domainName,
  poolName,
  clientConfiguration,
  poolConfiguration,
} from './config';
import { createClient, clientId } from './client';
import { assignUserToGroup, createGroup } from './group';
import {
  createUserPool,
  createDomain,
  deleteDomain,
  deleteUserPool,
  userPoolId,
  listPools,
} from './userPool';

export default {
  clientName,
  domainName,
  poolName,
  clientConfiguration,
  poolConfiguration,
  createClient,
  clientId,
  assignUserToGroup,
  createGroup,
  createUserPool,
  createDomain,
  deleteDomain,
  deleteUserPool,
  userPoolId,
  listPools,
};
