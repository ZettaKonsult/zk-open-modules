/* @flow */

export * as Account from './account'
export * as Role from './role'
export * as UserPool from './pool'

export { addConfig, getCognito, getIAM, updateConfigs } from './config'
export { requiredAttributes, setIdentity, Settings } from './settings'

export type Pool = {
  customer: string,
  project: string
}
