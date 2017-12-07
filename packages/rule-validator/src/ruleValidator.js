/**
 *  @date 2017-11-27
 */

export default (rules, values) => {
  checkNonempty(rules)
  valuesForEveryKeyExists(Object.keys(rules), values)

  let errors = {}
  Object.keys(rules).map(key => {
    let result = checkValues(values[key], rules[key])
    errors[key] = result
  })
  return errors
}

const checkValues = (value, rules) => {
  for (let key of Object.keys(rules)) {
    let message = rules[key](value)
    if (typeof message === "string" || !message) {
      return message
    }
  }
  return true
}

const valuesForEveryKeyExists = (keys, values) => {
  if (typeof values === "undefined") {
    throw new Error("No values defined.")
  }

  keys.map(key => {
    if (!(key in values)) {
      throw new Error(`No value defined for key ${key}.`)
    }
  })
  return true
}

const checkNonempty = rules =>
  Object.keys(rules).map(key => {
    let array = rules[key]
    if (typeof array === "undefined" || array.length <= 0) {
      throw new Error(`Expected non-empty rules array for key ${key}.`)
    }
  })
