/* @flow */

export * as Account from './account'
export * as Role from './role'
export * as UserPool from './pool'

export { addConfig, getCognito, getIAM } from './config'
export { requiredAttributes, setIdentity, settings, Settings } from './settings'

export type Pool = {
  customer: string,
  project: string
}
