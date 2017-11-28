/**
 * Utility module for managing file writing.
 *
 * @date    2017-08-12
 * @since   8.3.0
 */

/**
 * Appends a string to a file.
 * <p>
 * N.b. a file is created if none exists in the specified path.
 *
 * @param filePath  the path to the file.
 * @param string    the string to append.
 */
const append = async (filePath, string) => {
  throw new Error('NYI.')
}

/**
 * Appends a string to a file.
 * <p>
 * N.b. a file is created if none exists in the specified path.
 *
 * @param filePath  the path to the file.
 * @param string    the string to write.
 */
const write = async (filePath, string) => {
  throw new Error('NYI.')
}

module.exports = {
  append,

  write
}
