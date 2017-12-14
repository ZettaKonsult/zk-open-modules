import {
  buildUpdateExpression,
  buildAttributeValues,
  buildKeyConditionExpression
} from './queryBuilder'

describe('queryBuilder', () => {
  const values = { value1: 'hej', value2: 'nej' }
  describe('buildUpdateExpression()', () => {
    it('Returns the correct update expression from a key value object', () => {
      expect(buildUpdateExpression(values)).toBe(
        'SET value1 = :value1, value2 = :value2'
      )
    })
  })

  describe('buildAttributeValues()', () => {
    it('Returns the values object formated to DynamoDB standard', () => {
      expect(buildAttributeValues(values)).toEqual({
        ':value1': 'hej',
        ':value2': 'nej'
      })
    })
  })

  describe('buildKeyConditionExpression()', () => {
    it('Returns string representation from an array of keys', () => {
      const keys = ['key1', 'key2']
      expect(buildKeyConditionExpression(keys)).toBe(
        'key1 = :key1, key2 = :key2'
      )
    })
  })
})
