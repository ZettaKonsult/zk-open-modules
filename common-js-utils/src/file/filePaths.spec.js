/**
 * Tests for filePaths.
 *
 * @date  2017-09-28
 * @since 8.4.0
 */

const objectSize = require('object-size')
const format = require('util').format
const { isPath, isDirectory, isFile, listFiles } = require('./filePaths')

describe('filePaths.js.', () => {
  describe('isPath', () => {
    it('File exists.', async () => {
      expect(await isPath('mocks/MockCSV.csv')).toBe(true)
    })

    it('File non-existent.', async () => {
      expect(await isPath('mocks/dummy.csv')).toBe(false)
    })
  })

  describe('isDirectory', () => {
    it('Directory exists.', async () => {
      expect(await isDirectory('mocks')).toBe(true)
    })
  
    it('Directory non-existent.', async () => {
      expect(await isDirectory('notDirectory')).toBe(false)
    })

    it('Path is a file.', async () => {
      expect(await isDirectory('mocks/MockCSV.csv')).toBe(false)
    })
  })

  describe('isFile', () => {
    it('File exists.', async () => {
      expect(await isFile('mocks/MockCSV.csv')).toBe(true)
    })
  
    it('File non-existent.', async () => {
      expect(await isFile('mocks/dummy.csv')).toBe(false)
    })

    it('Path is a directory.', async () => {
      expect(await isFile('mocks')).toBe(false)
    })
  })

  describe('listFiles', () => {
    describe('Existent directory.', () => {
      it ('One file.', async () => {
        const list = await listFiles('mocks/fileLists/one')

        const dirs = list['dirs']
        const files = list['files']

        expect(objectSize(list)).toBe(2)
        expect(dirs.length).toBe(0)
        expect(files.length).toBe(1)

        expect(files[0]).toEqual('file.txt')
      })
      it ('One directory.', async () => {
        const list = await listFiles('mocks/fileLists/dir')

        const dirs = list['dirs']
        const files = list['files']

        expect(objectSize(list)).toBe(2)
        expect(dirs.length).toBe(1)
        expect(files.length).toBe(0)
        
        expect(dirs[0]).toEqual('subdir')
      })
      it ('Many directories and files.', async () => {
        const list = await listFiles('mocks/fileLists/several')

        const expectedDirectories = 5
        const expectedFiles = 5

        const dirs = list['dirs']
        const files = list['files']

        expect(objectSize(list)).toBe(2)
        expect(dirs.length).toBe(expectedDirectories)
        expect(files.length).toBe(expectedFiles)

        for (let i = 0; i < expectedDirectories; ++i) {
          expect(dirs[i]).toBe(format('dir%d', i))
        }
        for (let i = 0; i < expectedFiles; ++i) {
          expect(files[i]).toBe(format('file%d.txt', i))
        }
      })
    })

    it('Non-existent directory.', async () => {
      try {
        const people = await listFiles('mocks/fileLists/dummy')
        fail()
      } catch (error) {
        expect(error.message).toMatch('ENOENT: no such file or directory, scandir')
      }
    })
  })
})