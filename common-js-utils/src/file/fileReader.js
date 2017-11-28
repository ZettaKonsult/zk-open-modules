/**
 * Utility module for file reading.
 *
 * @date  2017-08-03
 * @since 7.9.0
 */

const fileSystem = require('fs')
const readline = require('readline')
const Stream = require('stream')

/**
 * Reads a file and returns its contents as a string.
 *
 * @param filePath  the path to the file to read.
 */
const fileAsString = async filePath =>
  new Promise((resolve, reject) => {
    fileSystem.readFile(filePath, 'utf-8', (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  })

/**
 * Parses a file and returns it contents as an array of string, where each
 * array member is a line in the file.
 * TODO: Implement options.
 *
 * @param filePath  the path to the file to read.
 * @param options   options for the function (TBI).
 */
const fileAsLines = async (filePath, options = {}) =>
  new Promise((resolve, reject) => {
    var inStream = fileSystem.createReadStream(filePath)
    var outStream = new Stream()
    var reader = readline.createInterface(inStream, outStream)

    let lines = []
    reader.on('line', line => {
      lines = [...lines, line]
    })

    reader.on('close', () => {
      resolve(lines)
    })
    reader.on('error', reject)
  })

module.exports = {
  fileAsString,
  fileAsLines
}
