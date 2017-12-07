/**
 * Tests for NumberMap.
 *
 * @date  2017-09-10
 * @since 8.4.0
 */

const { NumberMap } = require('./numberMap')

describe('NumberMap.', () => {
  describe('Constructors.', () => {
    it('No arguments.', () => {
      const map = new NumberMap()
      expect(map.size).toEqual(0)
    })
    it('Valid argument.', () => {
      const map = new NumberMap({'one': 1, 'two': 2})

      expect(map.size).toEqual(2)
      expect(map.get('one')).toEqual(1)
      expect(map.get('two')).toEqual(2)
    })
  })
  describe('Adding.', () => {
      it('Numerical values.', () => {
        const map = new NumberMap()

        map.add('one', 1)
        map.add('one', 2)
        expect(map.size).toEqual(1)
        expect(map.get('one')).toEqual(3)

        map.add('two', 2)
        expect(map.size).toEqual(2)
        expect(map.get('one')).toEqual(3)
        expect(map.get('two')).toEqual(2)

        map.add('three', 3)
        expect(map.size).toEqual(3)
        expect(map.get('one')).toEqual(3)
        expect(map.get('two')).toEqual(2)
        expect(map.get('three')).toEqual(3)
      })
      it('Non-numerical value.', () => {
        const map = new NumberMap({'one': 1, 'two': 2})

        try {
            map.add('one', '1')
            fail("No error was thrown.")
        } catch (error) {
            expect(error).toEqual(
                new TypeError('Can not add non-numerical values to a Number Map. ' +
                  `Got 1 (string).`)
            )
        }
      })
  })
  describe('Combining.', () => {
    describe('Correctly', () => {
      it('Using an object.', () => {
        const map = new NumberMap({'one': 1, 'two': 2})
        map.addAll({'two': 2, 'three': 3})

        expect(map.size).toEqual(3)
        expect(map.get('one')).toEqual(1)
        expect(map.get('two')).toEqual(4)
        expect(map.get('three')).toEqual(3)
      })
      it('Using number map.', () => {
        const map = new NumberMap({'one': 1, 'two': 2})
        map.join(new NumberMap({'two': 2, 'three': 3}))

        expect(map.size).toEqual(3)
        expect(map.get('one')).toEqual(1)
        expect(map.get('two')).toEqual(4)
        expect(map.get('three')).toEqual(3)
      })
    })
    describe('Incorrectly', () => {
      it('Using object.', () => {
        const map = new NumberMap({'one': 1, 'two': 2})

        try {
          map.join({'two': 2, 'three': 3})
          fail("No error was thrown.")
      } catch (error) {
          expect(error).toEqual(
              new TypeError('NumberMap.join() should only be used ' +
                  'with other NumberMaps.')
          )
      }
      })
      it('Using number map.', () => {
        const map = new NumberMap({'one': 1, 'two': 2})

        try {
          map.addAll(new NumberMap({'two': 2, 'three': 3}))
          fail("No error was thrown.")
      } catch (error) {
          expect(error).toEqual(
              new TypeError('NumberMap.addAll() should not be used ' +
                  'with NumberMaps.')
          )
      }
      })
    })
  })
})
