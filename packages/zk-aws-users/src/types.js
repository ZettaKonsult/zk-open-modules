/* @flow */

/**
 * @date 2017-12-15
 */

export type Attribute = {
  Mutable: boolean,
  Required: boolean,
  Name: string,
};

export type Pool = {
  customer: string,
  project: string,
};

export type Session = {
  token: string,
  groups: Array<string>,
};

export type AdminCreateData = {
  userName: string,
  names: Pool,
  attributes: { [string]: string },
};

export type SignUpData = AdminCreateData & {
  password: string,
};

export type PasswordChallengeCompleter = (
  userAttributes: { [string]: string },
  requiredAttributes: { [string]: string }
) => void;

export type LoginObject = {
  onSuccess: (result: Object) => string | void,
  onFailure: (error: Object) => Object | void,
  mfaRequired: (codeDeliveryDetails: Object) => Object,
  newPasswordRequired: PasswordChallengeCompleter,
};

export type LoginObjectFromUser = (user?: CognitoUser) => LoginObject;
