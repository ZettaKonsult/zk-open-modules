const csvParser = require('./csv-parser')

module.exports = {
  parseCSVFile: csvParser.parseFile,
  parseCSVLines: csvParser.parseLines,
  parseCSVString: csvParser.parseString
}
