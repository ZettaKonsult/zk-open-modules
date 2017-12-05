/**
 * @date    2017-10-17
 */

class NoSuchOption extends Error {
  constructor (optionName, questionName) {
    super(`Option '${optionName}' does not exist for ` +
    `Question ${questionName}.`)
  }
}

class Question {
  constructor (questionKey, questionMessage, possibleOptions) {
    this.key = questionKey
    this.message = questionMessage
    this.options = possibleOptions === undefined ? {} : possibleOptions
  }

  _checkOption (optionName) {
    if (!(optionName in this.options)) {
      throw new NoSuchOption(optionName, this.key)
    }
    return optionName
  }

  getMessage () {
    return this.message
  }

  getName () {
    return this.key
  }

  optionMessage (optionName) {
    return this.options[this._checkOption(optionName)]
  }

  optionNames () {
    return Object.keys(this.options)
  }

  numberOfOptions () {
    return this.optionNames().length
  }

  hasOption (optionName) {
    return optionName in this.options
  }

  hasOptions () {
    return this.numberOfOptions() > 0
  }

  fullMessage () {
    let message = this.getMessage()

    let i = 1
    for (let optName of Object.keys(this.options)) {
      message += `\n    ${i++}) ${this.options[optName]}`
    }

    return message
  }

  nextQuestion (chosenOption) {
    return this.options[this._checkOption(chosenOption)]
  }

  toJSON () {
    let {key, message, options} = this
    return {key, message, options}
  }
}

module.exports = {
  NoSuchOption,
  Question
}
