/* @flow */

/**
 * 2017-12-18
 */

export type Statement = {
  Action: Array<string>,
  Resource: Array<string>,
  Effect: string,
};

export type RoleStatement = {
  Action: Array<string>,
  Principal: { Federated: string },
  Effect: string,
};

export type Policy = {
  Version: string,
  Statement: Array<Statement>,
};

export type RolePolicy = {
  Version: string,
  Statement: Array<RoleStatement>,
};
