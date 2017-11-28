const array = require('./array')
const file = require('./file')
const map = require('./map')

module.exports = {
  arrayInsertItem: array.insertItem,
  arrayRemoveItem: array.removeItem,

  isPath: file.isPath,
  isDirectory: file.isDirectory,
  isFile: file.isFile,
  listFiles: file.listFiles,
  fileAsLines: file.fileAsLines,
  fileAsString: file.fileAsString,
  appendFile: file.append,
  writeFile: file.write,

  NumberMap: map.NumberMap
}
