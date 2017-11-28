/**
 * Map class rejecting non-numerical values.
 *
 * @date  2017-09-10
 * @since 8.4.0
 */

const checkValue = (value) => {
  if (typeof value !== 'number') {
    throw new TypeError('Can not add non-numerical values to a Number Map. ' +
      `Got ${value} (${typeof value}).`)
  }
  return value
}

class NumberMap extends Map {
  constructor (map = {}) {
    super()
    this.addAll(map)
  }

  add (key, value) {
    this.set(key, checkValue(value) + (this.has(key) ? this.get(key) : 0))
  }

  addAll (object) {
    if (object instanceof NumberMap) {
      throw new TypeError('NumberMap.addAll() should not be used ' +
          'with NumberMaps.')
    }

    for (let key of Object.keys(object)) {
      this.add(key, object[key])
    }
  }

  join (numberMap) {
    if (!(numberMap instanceof NumberMap)) {
      throw new TypeError('NumberMap.join() should only be used with ' +
          'other NumberMaps.')
    }

    for (let key of numberMap.keys()) {
      this.add(key, numberMap.get(key))
    }
  }

  set (key, value) {
    super.set(key, checkValue(value))
  }
}

module.exports = {
  NumberMap
}
