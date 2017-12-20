/* @flow */

export * as Account from './account'
export * as Role from './role'
export * as UserPool from './pool'

export { requiredAttributes, setIdentity, Settings } from './config'

export type Pool = {
  customer: string,
  project: string
}
