const { isPath, isDirectory, isFile, listFiles } = require('./filePaths')
const { fileAsString, fileAsLines } = require('./fileReader')
const { append, write } = require('./fileWriter')

module.exports = {
  isPath,
  isDirectory,
  isFile,
  listFiles,
  fileAsString,
  fileAsLines,
  append,
  write
}
