/* @flow */

import Account from './account';
import UserPool from './pool';

import { addConfig, getCognito, getIAM, getAWS, updateConfigs } from './config';
import Settings, { requiredAttributes, setIdentity } from './settings';

export default (config: { [string]: string }) => {
  Settings(config);
  return {
    Account,
    UserPool,
    addConfig,
    getCognito,
    getIAM,
    getAWS,
    updateConfigs,
    requiredAttributes,
    setIdentity,
  };
};
