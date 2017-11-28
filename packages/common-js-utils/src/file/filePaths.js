/**
 * Utility module for managing file paths.
 * Mostly short-hand functions for fs.lstat().
 *
 * @date  2017-09-28
 * @since 8.4.0
 */

const NO_SUCH_FILE_ERR = 'ENOENT'
const fileSystem = require('fs')

/**
 * Check if path exists.
 */
const isPath = async (filePath) =>
    await isDirectory(filePath) || await isFile(filePath) || false

/**
 * Check if path is a directory.
 */
const isDirectory = async (filePath) =>
  new Promise((resolve, reject) => {
    fileSystem.stat(filePath, (error, stats) => {
      if (error) {
        if (error.code !== NO_SUCH_FILE_ERR) {
          return reject(error)
        }
        return resolve(false)
      }
      return resolve(stats.isDirectory())
    })
  })

/**
 * Check if path is a file.
 */
const isFile = async (filePath) =>
  new Promise((resolve, reject) => {
    fileSystem.stat(filePath, (error, stats) => {
      if (error) {
        if (error.code !== NO_SUCH_FILE_ERR) {
          return reject(error)
        }
        return resolve(false)
      }
      return resolve(stats.isFile())
    })
  })

/**
 * Reads all file and directory names in a directory.
 */
const listFiles = async (filePath) =>
  new Promise((resolve, reject) => {
    fileSystem.readdir(filePath, async (error, result) => {
      if (error) {
        return reject(error)
      }

      const dirs = []
      const files = []

      for (let path of result) {
        (await isDirectory(filePath + '/' + path) ? dirs : files).push(path)
      }

      return resolve({
        'dirs': dirs,
        'files': files
      })
    })
  })

module.exports = {
  isPath,
  isDirectory,
  isFile,
  listFiles
}
