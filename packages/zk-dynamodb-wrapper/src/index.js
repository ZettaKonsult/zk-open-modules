/* @flow */

import AWS from 'aws-sdk';

import { list } from './list';
import { update } from './update';
import { get } from './get';
import { create } from './create';
import { remove } from './delete';

export default (params: { region: string, auth: () => any }) => {
  const { region, auth } = params;

  AWS.config.update({ region });
  return {
    beforeEach: async function(): any {
      return await auth();
    },

    create: async function(params: {
      TableName: string,
      Item: { [string]: string },
    }): Promise<{ [string]: string }> {
      await this.beforeEach();
      return create(params);
    },

    get: async function(params: {
      TableName: string,
      Key: string,
    }): Promise<{ [string]: string } | string> {
      await this.beforeEach();
      return get(params);
    },

    list: async function(params: {
      TableName: string,
      Values: { [string]: string },
    }): Promise<{ [string]: string } | string> {
      await this.beforeEach();
      return await list(params);
    },

    remove: async function(params: {
      TableName: string,
      Key: string,
    }): Promise<boolean> {
      await this.beforeEach();
      return await remove(params);
    },

    update: async function(params: {
      TableName: string,
      Key: string,
      Values: { [string]: string },
    }): Promise<void> {
      await this.beforeEach();
      return await update(params);
    },
  };
};

export function call(action: string, params: { [string]: any }) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  return dynamoDb[action](params).promise();
}
