/**
 * @date  2017-08-11
 */

const { parseFile, parseLines, parseString } = require('./csv-parser')
const { fileAsLines } = require('common-js-utils')

describe('Tests csv-parser.js.', () => {
  describe('Parse file.', () => {
    it('Dimensions.', async () => {
      const cells = await parseFile('mocks/sample.csv')
      expect(cells.length).toBe(1000)

      for (let line of cells) {
        expect(line.length).toBe(6)
      }
    })
    it('First and last line,', async () => {
      const cells = await parseFile('mocks/sample.csv')
      expect(cells[0]).toEqual(['id', 'first_name', 'last_name', 'email',
        'gender', 'ip_address'])
      expect(cells[cells.length - 1]).toEqual(['999', 'Sidney',
        'Birchenough', 'sbirchenoughrq@merriam-webster.com',
        'Male', '30.50.101.37'])
    })
    describe('Options', () => {
      describe('Skip.', () => {
        it('Skip first and last lines.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                    {skipFirst: 12, skipLast: 12})
          const length = cells.length

          expect(length).toBe(976)
          expect(cells[0]).toEqual(['12', 'Devon', 'Wickins',
            'dwickinsb@aboutads.info', 'Female', '81.81.161.31'])
          expect(cells[length - 1]).toEqual(['987', 'Rorke', 'Teers',
            'rteersre@jigsy.com', 'Male', '49.22.131.227'])
        })
        it('Skip everything.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                    {skipFirst: 750, skipLast: 750})
          expect(length).toBe(0)
        })
      })
      describe('Limit', () => {
        it('Row limit only.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                    {lineLimit: 10})
          const length = cells.length

          expect(length).toBe(10)
          expect(cells[0]).toEqual(['id', 'first_name', 'last_name',
            'email', 'gender', 'ip_address'])
          expect(cells[length - 1]).toEqual(['9', 'Geoffrey',
            'Ashborne', 'gashborne8@utexas.edu',
            'Male', '25.32.250.62'])
        })
        it('Zero limit.', async () => {
          let cells = await parseFile('mocks/sample.csv',
                    {lineLimit: 0})
          expect(cells.length).toBe(0)
        })
        it('Negative limit.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                    {lineLimit: -1000})
          expect(cells.length).toBe(1000)
        })
      })
      describe('Header', () => {
        it('Empty header.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                            {header: [] })
          const length = cells.length

          expect(length).toBe(1000)
          expect(cells[0]).toEqual(['id', 'first_name', 'last_name', 'email',
            'gender', 'ip_address'])
          expect(cells[length - 1]).toEqual(['999', 'Sidney',
            'Birchenough', 'sbirchenoughrq@merriam-webster.com',
            'Male', '30.50.101.37'])
        })
        it('One header field.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                            {header: ['Wahoo'] })
          const length = cells.length

          expect(length).toBe(1001)
          expect(cells[0]).toEqual(['Wahoo'])
          expect(cells[1]).toEqual(['id', 'first_name', 'last_name', 'email',
            'gender', 'ip_address'])
          expect(cells[2]).toEqual(['1', 'Betteann',
            'Agiolfinger', 'bagiolfinger0@addthis.com',
            'Female', '242.96.99.109'])
          expect(cells[length - 1]).toEqual(['999', 'Sidney',
            'Birchenough', 'sbirchenoughrq@merriam-webster.com',
            'Male', '30.50.101.37'])
        })
        it('Many header fields.', async () => {
          const cells = await parseFile('mocks/sample.csv',
            {header: ['Wahoo', 'Yahooo', 'Wahaaa',
              'It\'s-ah-me', 'Mama mia'] })
          const length = cells.length

          expect(length).toBe(1001)
          expect(cells[0]).toEqual(['Wahoo', 'Yahooo', 'Wahaaa',
            'It\'s-ah-me', 'Mama mia'])
          expect(cells[1]).toEqual(['id', 'first_name', 'last_name', 'email',
            'gender', 'ip_address'])
          expect(cells[2]).toEqual(['1', 'Betteann',
            'Agiolfinger', 'bagiolfinger0@addthis.com',
            'Female', '242.96.99.109'])
          expect(cells[length - 1]).toEqual(['999', 'Sidney',
            'Birchenough', 'sbirchenoughrq@merriam-webster.com',
            'Male', '30.50.101.37'])
        })
      })
      describe('Delimiter', () => {
        it('Only colon', async () => {
          const cells = await parseFile('mocks/delimiter.csv',
          { delimiter: ',' })

          expect(cells[0].length).toEqual(3)
          expect(cells[1].length).toEqual(5)
          expect(cells[0]).toEqual([
            'A;B', ';C;D', ';E'
          ])
          expect(cells[1]).toEqual([
            'A', 'B;', 'C', 'D;', 'E'
          ])
        })
        it('Only semicolon', async () => {
          const cells = await parseFile('mocks/delimiter.csv',
                                { delimiter: ';' })

          expect(cells[0].length).toEqual(5)
          expect(cells[1].length).toEqual(3)
          expect(cells[0]).toEqual([
            'A', 'B,', 'C', 'D,', 'E'
          ])
          expect(cells[1]).toEqual([
            'A,B', ',C,D', ',E'
          ])
        })
      })
      describe('Combined options.', () => {
        it('Limit with skips.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                            {skipFirst: 12, skipLast: 12, lineLimit: 10})
          const length = cells.length

          expect(length).toBe(10)
          expect(cells[0]).toEqual(['12', 'Devon', 'Wickins',
            'dwickinsb@aboutads.info', 'Female', '81.81.161.31'])
          expect(cells[length - 1]).toEqual(['21', 'Judie',
            'Harniman', 'jharnimank@statcounter.com',
            'Female', '212.190.31.126'])
        })
        it('Zero limit with skips.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                            {skipFirst: 12, skipLast: 12, lineLimit: 0})

          expect(cells.length).toBe(0)
        })
        it('Negative limit with skips.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                            {skipFirst: 12, skipLast: 12, lineLimit: -1000})
          const length = cells.length

          expect(length).toBe(976)
          expect(cells[0]).toEqual(['12', 'Devon', 'Wickins',
            'dwickinsb@aboutads.info', 'Female', '81.81.161.31'])
          expect(cells[length - 1]).toEqual(['987', 'Rorke', 'Teers',
            'rteersre@jigsy.com', 'Male', '49.22.131.227'])
        })
        it('Header with limit.', async () => {
          const cells = await parseFile('mocks/sample.csv',
            {lineLimit: 10,
              header: ['Wahoo', 'Yahooo', 'Wahaaa',
                'It\'s-ah-me', 'Mama mia']})
          const length = cells.length

          expect(length).toBe(11)
          expect(cells[0]).toEqual(['Wahoo', 'Yahooo', 'Wahaaa',
            'It\'s-ah-me', 'Mama mia'])
          expect(cells[1]).toEqual(['id', 'first_name', 'last_name', 'email',
            'gender', 'ip_address'])
          expect(cells[2]).toEqual(['1', 'Betteann',
            'Agiolfinger', 'bagiolfinger0@addthis.com',
            'Female', '242.96.99.109'])
          expect(cells[length - 1]).toEqual(['9', 'Geoffrey', 'Ashborne',
            'gashborne8@utexas.edu', 'Male', '25.32.250.62'])
        })
        it('Header with zero limit.', async () => {
          const cells = await parseFile('mocks/sample.csv',
            {lineLimit: 0,
              header: ['Wahoo', 'Yahooo', 'Wahaaa',
                'It\'s-ah-me', 'Mama mia']})
          const length = cells.length

          expect(length).toBe(1)
          expect(cells[0]).toEqual(['Wahoo', 'Yahooo', 'Wahaaa',
            'It\'s-ah-me', 'Mama mia'])
        })
        it('Header with negative limit.', async () => {
          const cells = await parseFile('mocks/sample.csv',
            {limit: -1000,
              header: ['Wahoo', 'Yahooo', 'Wahaaa',
                'It\'s-ah-me', 'Mama mia'] })
          const length = cells.length

          expect(length).toBe(1001)
          expect(cells[0]).toEqual(['Wahoo', 'Yahooo', 'Wahaaa',
            'It\'s-ah-me', 'Mama mia'])
          expect(cells[1]).toEqual(['id', 'first_name', 'last_name', 'email',
            'gender', 'ip_address'])
          expect(cells[2]).toEqual(['1', 'Betteann',
            'Agiolfinger', 'bagiolfinger0@addthis.com',
            'Female', '242.96.99.109'])
          expect(cells[length - 1]).toEqual(['999', 'Sidney',
            'Birchenough', 'sbirchenoughrq@merriam-webster.com',
            'Male', '30.50.101.37'])
        })
        it('Header with skips.', async () => {
          const cells = await parseFile('mocks/sample.csv',
            {skipFirst: 12,
              skipLast: 12,
              header: ['Wahoo', 'Yahooo', 'Wahaaa',
                'It\'s-ah-me', 'Mama mia'] })
          const length = cells.length

          expect(length).toBe(977)
          expect(cells[0]).toEqual(['Wahoo', 'Yahooo', 'Wahaaa',
            'It\'s-ah-me', 'Mama mia'])
          expect(cells[1]).toEqual(['12', 'Devon', 'Wickins',
            'dwickinsb@aboutads.info', 'Female', '81.81.161.31'])
          expect(cells[length - 1]).toEqual(['987', 'Rorke', 'Teers',
            'rteersre@jigsy.com', 'Male', '49.22.131.227'])
        })
        it('Header with skip everything.', async () => {
          const cells = await parseFile('mocks/sample.csv',
            {skipFirst: 750,
              skipLast: 750,
              header: ['Wahoo', 'Yahooo', 'Wahaaa',
                'It\'s-ah-me', 'Mama mia']})
          const length = cells.length

          expect(length).toBe(1)
          expect(cells[0]).toEqual(['Wahoo', 'Yahooo', 'Wahaaa',
            'It\'s-ah-me', 'Mama mia'])
        })
        it('Zero limit with skips.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                    {skipFirst: 12, skipLast: 12, lineLimit: 0})

          expect(cells.length).toBe(0)
        })
        it('Negative limit with skips.', async () => {
          const cells = await parseFile('mocks/sample.csv',
                    {skipFirst: 12, skipLast: 12, lineLimit: -1000})
          const length = cells.length

          expect(length).toBe(976)
          expect(cells[0]).toEqual(['12', 'Devon', 'Wickins',
            'dwickinsb@aboutads.info', 'Female', '81.81.161.31'])
          expect(cells[length - 1]).toEqual(['987', 'Rorke', 'Teers',
            'rteersre@jigsy.com', 'Male', '49.22.131.227'])
        })
      })
    })
  })
  it('Parse lines.', async () => {
    const fileCells = await parseFile('mocks/overrides.csv',
      {skipFirst: 2,
        skipLast: 2,
        header: ['Wahoo', 'Yahooo', 'Wahaaa',
          'It\'s-ah-me', 'Mama mia']})

    expect(await parseLines([
      'A;B,;C;D,;E',
      'A,B;,C,D;,E',
      'A;B,;C;D,;E',
      '',
      'A;B,;C;D,;E',
      'A,B;,C,D;,E',
      'A,B;,C,D;,E'
    ], {skipFirst: 2,
      skipLast: 2,
      header: ['Wahoo', 'Yahooo', 'Wahaaa',
        'It\'s-ah-me', 'Mama mia']})).toEqual(fileCells)
  })
  it('Parse string.', async () => {
    const fileCells = await parseFile('mocks/overrides.csv',
      {skipFirst: 2,
        skipLast: 2,
        header: ['Wahoo', 'Yahooo', 'Wahaaa',
          'It\'s-ah-me', 'Mama mia']})

    expect(await parseString(
      'A;B,;C;D,;E\nA,B;,C,D;,E\nA;B,;C;D,;E\n' +
        '\nA;B,;C;D,;E\nA,B;,C,D;,E\nA,B;,C,D;,E'
    , {skipFirst: 2,
      skipLast: 2,
      header: ['Wahoo', 'Yahooo', 'Wahaaa',
        'It\'s-ah-me', 'Mama mia']})).toEqual(fileCells)
  })
  it('CRLF', async () => {
    const fileCells = await parseFile('mocks/overrides.csv',
      {skipFirst: 2,
        skipLast: 2,
        header: ['Wahoo', 'Yahooo', 'Wahaaa',
          'It\'s-ah-me', 'Mama mia']})

    expect(await parseString(
    'A;B,;C;D,;E\r\nA,B;,C,D;,E\r\nA;B,;C;D,;E\r\n' +
      '\r\nA;B,;C;D,;E\r\nA,B;,C,D;,E\r\nA,B;,C,D;,E'
  , {skipFirst: 2,
    skipLast: 2,
    header: ['Wahoo', 'Yahooo', 'Wahaaa',
      'It\'s-ah-me', 'Mama mia']})).toEqual(fileCells)
  })
})
