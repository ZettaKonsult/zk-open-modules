import AWS from 'aws-sdk'

import { list } from './list'
import { update } from './update'
import { get } from './get'
import { create } from './create'
import { remove } from './delete'

export default ({ region, auth = () => {} }) => {
  AWS.config.update({ region })
  return {
    beforeEach: async function() {
      return await auth()
    },

    create: async function({ TableName, Item }) {
      await this.beforeEach()
      return create({ TableName, Item })
    },

    get: async function({ TableName, Key }) {
      await this.beforeEach()
      return get({
        TableName,
        Key
      })
    },

    list: async function({ TableName, Values }) {
      await this.beforeEach()
      return await list({
        TableName,
        Values
      })
    },

    update: async function({ TableName, Key, Values }) {
      await this.beforeEach()
      return await update({
        TableName,
        Key,
        Values
      })
    },

    remove: async function({ TableName, Key }) {
      await this.beforeEach()
      return await remove({
        TableName,
        Key
      })
    }
  }
}

export function call(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  return dynamoDb[action](params).promise()
}
