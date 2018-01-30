/* @flow */

import Account from './account';
import UserPool from './pool';

import Settings, { requiredAttributes } from './settings';

export default (params: { config: { [string]: string } }) => {
  Settings(params);
  return {
    Account,
    UserPool,
    requiredAttributes,
  };
};
