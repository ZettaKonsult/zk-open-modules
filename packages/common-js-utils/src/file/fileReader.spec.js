/**
 * @date  2017-08-03
 */

const { fileAsLines, fileAsString } = require('./fileReader')

describe('Tests fileReader.js.', () => {
  describe('fileAsString', () => {
    it('Correctness.', async () => {
      const text = await fileAsString('mocks/MockSmallText.txt')
      expect(text).toMatch(/This is a file\s*with little text.\s*/)
    })
  })

  describe('fileAsLines', () => {
    let lines = []
    beforeAll(async () => {
      lines = await fileAsLines('mocks/MockCSV.csv')
    })

    it('Number of lines.', async () => {
      expect(lines.length).toEqual(1001)
    })

    it('First line regex match.', async () => {
      expect(lines[0]).toMatch(
        /id,first_name,last_name,email,gender,ip_address/
      )
    })

    it('Last line regex match.', async () => {
      expect(lines[lines.length - 1]).toMatch(
        /1000,Corliss,Edghinn,cedghinnrr@themeforest.net,Female,108.110.163.101/
      )
    })
  })
})
