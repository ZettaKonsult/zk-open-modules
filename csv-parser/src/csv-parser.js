/**
 * Utility module for CSV file parsing.
 *
 * @date  2017-08-12
 * @since 7.9.0
 */

const { fileAsLines } = require('common-js-utils')

const DEFAULT_DELIM = [ ',', ';' ]

const parseLines = (lines, { delimiter = DEFAULT_DELIM,
  skipFirst = 0,
  skipLast = 0,
  lineLimit = -1,
  header = [] } = {}) => {
  let linesToRead = lineLimit >= 0 ? lineLimit : lines.length
  let cells = []

  const ignoreFirst = Math.max(0, skipFirst)
  const ignoreLast = Math.max(0, skipLast)

  if (header.length > 0) {
    cells.push(header)
  }

  const lastLine = Math.min(lines.length - ignoreLast, linesToRead + ignoreFirst)
  const regexp = delimiterString(delimiter)

  for (let i = ignoreFirst; i < lastLine; ++i) {
    cells.push(lines[i].split(regexp))
  }

  return cells
}

const parseString = async (stringData, options) => {
  return parseLines(stringData.split(/[ \t]*[\r]?\n[ \t]*/), options)
}

const parseFile = async (filePath, options) => {
  return parseLines(await fileAsLines(filePath), options)
}

/**
 * Create a regular expression for delimiting on one or more characters.
 */
const delimiterString = (delimiters) => {
  let string = ''

  if (Array.isArray(delimiters)) {
    let prefix = ''

    for (let delim of delimiters) {
      string += prefix + delim
      prefix = '|'
    }
  } else {
    string = delimiters
  }

  return new RegExp('\\s*[' + string + ']\\s*')
}

module.exports = {
  parseFile,
  parseLines,
  parseString
}
