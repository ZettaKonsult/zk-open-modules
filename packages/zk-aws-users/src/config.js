/* @flow */
/**
 * @date 2017-12-21
 */

import AWS from 'aws-sdk';
import { Settings } from './settings';

AWS.config.update({ region: Settings.Region });

let cognito;

export const getAWS = (): AWS => {
  if (!AWS.config.credentials) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      AccessKeyId: Settings.AccessKey,
      IdentityPoolId: Settings.Identity.PoolId,
    });
  }
  return AWS;
};

export const getCognito = (): CognitoIdentityServiceProvider => {
  if (cognito == null) {
    cognito = new (getAWS()).CognitoIdentityServiceProvider();
  }
  return cognito;
};
