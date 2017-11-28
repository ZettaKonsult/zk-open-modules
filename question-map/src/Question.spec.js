/**
 * Tests for the Question class.
 *
 * @date  2017-10-17
 * @since 8.4.0
 */

const { NoSuchOption, Question } = require('./Question')

const NO_OPTIONS = new Question(
    'no_opt', 'This is an end question.'
)

const ONE_OPTION = new Question(
    'one_opt', 'This is the illusion of choice.',
  {
    'one_opt_child1': 'There is only one way.'
  }
)

const MANY_OPTIONS = new Question(
    'many_opt', 'The pick of the litter.',
  {
    'many_opt_child1': 'Don\'t go here.',
    'many_opt_child2': 'I can\'t do that, Dave.'
  }
)

describe('Question.', () => {
  describe('Messages.', () => {
    describe('Valid usage.', () => {
      it('Full question messages.', () => {
        expect(NO_OPTIONS.fullMessage()).toEqual(
                    'This is an end question.')
        expect(ONE_OPTION.fullMessage()).toEqual(
                    'This is the illusion of choice.\n' +
                    '    1) There is only one way.'
                )
        expect(MANY_OPTIONS.fullMessage()).toEqual(
                    'The pick of the litter.\n' +
                    '    1) Don\'t go here.\n' +
                    '    2) I can\'t do that, Dave.'
                )
      })
      it('Question messages.', () => {
        expect(NO_OPTIONS.getMessage()).toEqual('This is an ' +
                    'end question.')
        expect(ONE_OPTION.getMessage()).toEqual('This is the illusion ' +
                    'of choice.')
        expect(MANY_OPTIONS.getMessage()).toEqual('The pick of ' +
                    'the litter.')
      })
      it('Option messages.', () => {
        expect(ONE_OPTION.optionMessage('one_opt_child1')).toEqual('There is only one way.')
        expect(MANY_OPTIONS.optionMessage('many_opt_child1')).toEqual('Don\'t go here.')
        expect(MANY_OPTIONS.optionMessage('many_opt_child2')).toEqual('I can\'t do that, Dave.')
      })
    })
    describe('Invalid usage.', () => {
      it('Getting option when none exist.', () => {
        try {
          const msg = NO_OPTIONS.optionMessage('dummy_opt')
          fail('Requesting an non-existent option should ' +
                        'raise a NoSuchOption error.')
        } catch (error) {
          expect(error).toEqual(
                        new NoSuchOption('dummy_opt', 'no_opt')
                    )
        }
      })
      it('Wrong option name.', () => {
        try {
          const msg = MANY_OPTIONS.optionMessage('dummy_opt')
          fail('Requesting an non-existent option should ' +
                        'raise a NoSuchOption error.')
        } catch (error) {
          expect(error).toEqual(
                        new NoSuchOption('dummy_opt', 'many_opt')
                    )
        }
      })
    })
  })
  describe('Options.', () => {
    it('Has option.', () => {
      expect(ONE_OPTION.hasOption('one_opt_child1')).toBe(true)
      expect(MANY_OPTIONS.hasOption('many_opt_child1')).toBe(true)
      expect(MANY_OPTIONS.hasOption('many_opt_child2')).toBe(true)
      expect(NO_OPTIONS.hasOption('dummy_opt')).toBe(false)
      expect(ONE_OPTION.hasOption('dummy_opt')).toBe(false)
      expect(MANY_OPTIONS.hasOption('dummy_opt')).toBe(false)
    })
    it('Number of options.', () => {
      expect(NO_OPTIONS.numberOfOptions()).toBe(0)
      expect(ONE_OPTION.numberOfOptions()).toBe(1)
      expect(MANY_OPTIONS.numberOfOptions()).toBe(2)
    })
    it('Has options.', () => {
      expect(NO_OPTIONS.hasOptions()).toBe(false)
      expect(ONE_OPTION.hasOptions()).toBe(true)
      expect(MANY_OPTIONS.hasOptions()).toBe(true)
    })
  })
  describe('To JSON.', () => {
    expect(NO_OPTIONS.toJSON()).toEqual(
      {
        'key': 'no_opt',
        'message': 'This is an end question.',
        'options': {}
      }
        )
    expect(ONE_OPTION.toJSON()).toEqual(
      {
        'key': 'one_opt',
        'message': 'This is the illusion of choice.',
        'options': {
          'one_opt_child1': 'There is only one way.'
        }
      }
        )
    expect(MANY_OPTIONS.toJSON()).toEqual(
      {
        'key': 'many_opt',
        'message': 'The pick of the litter.',
        'options': {
          'many_opt_child1': 'Don\'t go here.',
          'many_opt_child2': 'I can\'t do that, Dave.'
        }
      }
        )
  })
})
