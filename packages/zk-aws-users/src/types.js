/* @flow */

/**
 * @date 2017-12-15
 */

export type Attribute = {
  mutable: boolean,
  required: boolean,
  name: string,
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
  user: string,
  pool: string,
  attributes: { [string]: string },
};

export type SignUpData = AdminCreateData & {
  password: string,
  client: string,
};

export type UserHandler = {
  pool: Pool,
  user: CognitoUser,
  details: AuthenticationDetails,
};

export type PasswordChallengeCompleter = (
  attributes: { [string]: string },
  required: { [string]: string }
) => void;

export type LoginObject = {
  onSuccess: (result: Object) => string | void,
  onFailure: (error: Object) => Object | void,
  mfaRequired: (codeDeliveryDetails: Object) => Object,
  newPasswordRequired: PasswordChallengeCompleter,
};

export type LoginObjectFromUser = (user?: CognitoUser) => LoginObject;
