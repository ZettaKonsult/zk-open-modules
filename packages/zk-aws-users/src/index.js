/* @flow */

import Account from './account';
import Session from './session';
import UserPool from './pool';
const { Client, Domain, Group, Pool } = UserPool;

import Settings, { requiredAttributes } from './settings';

export default (params: { config: { [string]: string } }) => {
  Settings(params);
  return {
    Account,
    Client,
    Domain,
    Group,
    Pool,
    Session,
    requiredAttributes,
  };
};
