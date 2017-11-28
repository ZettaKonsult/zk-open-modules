/**
 * Class representing a map of questions to answer.
 *
 * @date  2017-10-23
 * @since 8.4.0
 */

const {Question, NoSuchOption} = require('./Question')

class NoSuchQuestion extends Error {}

class QuestionMap {
  constructor (rootQuestion, ...questions) {
    this.answers = []
    this.questions = {}
    this.root = this.currentQuestion = this._parseQuestion(rootQuestion)

    for (let i = 0; i < questions.length; ++i) {
      const question = this._parseQuestion(questions[i])
      this.questions[question.getName()] = question
    }
    this.questions[this.root.getName()] = this.root
    this.questions = this._checkQuestionReferences(this.questions)
  }

  _parseQuestion (question) {
    if (question instanceof Question) {
      return question
    }

    return new Question(question['name'],
      question['message'], question['options'])
  }

  _checkQuestionReferences (questions) {
    let errors = new Set()

    for (let questionName of Object.keys(questions)) {
      for (let optionName of this.questions[questionName].optionNames()) {
        if (!(optionName in questions)) {
          errors.add(optionName)
        }
      }
    }

    if (errors.size >= 1) {
      throw new NoSuchQuestion('Options pointing to non-existent questions: ' +
        `${Array.from(errors.values())}`)
    }

    return questions
  }

  getRoot () {
    return this.root
  }

  answerQuestion (reply) {
    const questionName = this.currentQuestion.getName()
    if (!this.isValidAnswer(reply)) {
      throw new NoSuchOption(reply, questionName)
    }

    this.answers.push([questionName, reply])
    this.currentQuestion = this.questions[reply]
  }

  getAnswers () {
    return this.answers
  }

  getCurrentQuestion () {
    return this.currentQuestion
  }

  revertAnswer () {
    if (this.answers.length <= 0) {
      throw new Error('No answers have been submitted.')
    }

    this.currentQuestion = this.questions[this.answers.pop()[0]]
  }

  isValidAnswer (reply) {
    return this.currentQuestion.hasOption(reply)
  }

  hasValidAnswers () {
    return this.currentQuestion.hasOptions()
  }

  toJSON () {
    let {answers, question} = this
    let currentQuestion = question.toJSON()
    return {answers, currentQuestion}
  }
}

module.exports = {
  QuestionMap,
  Question,
  NoSuchOption,
  NoSuchQuestion
}
