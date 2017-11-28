const { insertItem, removeItem } = require('./updatePatterns')

describe('updatePatterns', () => {
  describe('insertItem()', () => {
    it('inserts item last if no index is provided', () => {
      let array = ['foo']
      const item = 'bar'

      array = insertItem(array, item)
      expect(array[1]).toBe('bar')
    })

    it('inserts at given index', () => {
      let array = ['foo']
      const item = 'bar'

      array = insertItem(array, item, 0)
      expect(array[0]).toBe('bar')
    })
  })

  describe('removeItem()', () => {
    it('removes item from given index', () => {
      let array = ['foo', 'bar']

      array = removeItem(array, 0)
      expect(array.length).toBe(1)
    })
  })
})
