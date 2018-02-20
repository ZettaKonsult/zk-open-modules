/* @flow */

import Account from './account';
import Session from './session';
import UserPool from './pool';
import Settings, { requiredAttributes } from './settings';
const { Client, Domain, Group, Pool } = UserPool;

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
