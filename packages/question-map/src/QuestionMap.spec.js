/**
 * Tests for the QuestionMap class.
 *
 * @date  2017-10-23
 * @since 8.4.0
 */

const {QuestionMap, Question, NoSuchOption, NoSuchQuestion} =
  require('./QuestionMap')

const ROOT = new Question('Top', 'TopM', {
  'QA': 'Start with A?',
  'QB': 'Start with B?',
  'QC': 'Start with C?',
  'QD': 'Start with D?'
})

const makeTree = () => new QuestionMap(
  {
    'name': 'Top',
    'message': 'TopM',
    'options': {
      'QA': 'Start with A?',
      'QB': 'Start with B?',
      'QC': 'Start with C?',
      'QD': 'Start with D?'
    }
  },
  new Question('QA', 'MA', {
    'QB': 'Go to B?',
    'QC': 'Go to C?'
  }),
  new Question('QB', 'MB', {
    'QA': 'Go to A?',
    'QC': 'Go to C?'
  }),
  new Question('QC', 'MC', {
    'QA': 'Go to A?',
    'QB': 'Go to B?',
    'QD': 'Go to D?'
  }),
  new Question('QD', 'MD')
)

describe('Question Tree', () => {
  describe('Construction.', () => {
    it('Non-question construction.', () => {
      expect(new QuestionMap({
        'name': 'Top',
        'message': 'TopM',
        'options': {
          'QA': 'Start with A?',
          'QB': 'Start with B?',
          'QC': 'Start with C?',
          'QD': 'Start with D?'
        }
      },
        {
          'name': 'QA',
          'message': 'MA',
          'options': {
            'QB': 'Go to B?',
            'QC': 'Go to C?'
          }
        },
        {
          'name': 'QB',
          'message': 'MB',
          'options': {
            'QA': 'Go to A?',
            'QC': 'Go to C?'
          }
        },
        {
          'name': 'QC',
          'message': 'MC',
          'options': {
            'QA': 'Go to A?',
            'QB': 'Go to B?',
            'QD': 'Go to D?'
          }
        },
        {
          'name': 'QD',
          'message': 'MD'
        }
      )).toEqual(makeTree())
    })
    it('Only questions.', () => {
      expect(new QuestionMap(
        new Question('Top', 'TopM',
          {
            'QA': 'Start with A?',
            'QB': 'Start with B?',
            'QC': 'Start with C?',
            'QD': 'Start with D?'
          }
        ),
        new Question('QA', 'MA', {
          'QB': 'Go to B?',
          'QC': 'Go to C?'
        }),
        new Question('QB', 'MB', {
          'QA': 'Go to A?',
          'QC': 'Go to C?'
        }),
        new Question('QC', 'MC', {
          'QA': 'Go to A?',
          'QB': 'Go to B?',
          'QD': 'Go to D?'
        }),
        new Question('QD', 'MD'))).toEqual(makeTree())
    })
    it('Missing option reference.', () => {
      try {
        const map = new QuestionMap(
          {
            'name': 'Top',
            'message': 'TopM',
            'options': {
              'QA': 'Start with A?',
              'QB': 'Start with B?'
            }
          },
          {
            'name': 'QA',
            'message': 'Choose C.',
            'options': {
              'QC': 'Go to C.'
            }
          }
        )
        fail('Creating a QuestionMap with option references to non-existent ' +
          'questions should raise a NoSuchQuestion error.')
      } catch (error) {
        expect(error).toEqual(
              new NoSuchQuestion('Options pointing to non-existent questions: ' +
              `QC,QB`)
          )
      }
    })
  })
  describe('Getters and setters.', () => {
    it('Current Question.', () => {
      expect(makeTree().getCurrentQuestion()).toEqual(ROOT)
    })
    it('Get answers.', () => {
      expect(makeTree().getAnswers()).toEqual([])
    })
    it('Root.', () => {
      expect(makeTree().getRoot()).toEqual(ROOT)
    })
  })
  describe('Answers.', () => {
    describe('Answer questions.', () => {
      it('One.', () => {
        const TREE = makeTree()
        TREE.answerQuestion('QA')
        expect(TREE.getCurrentQuestion()).toEqual(
          new Question('QA', 'MA',
            {
              'QB': 'Go to B?',
              'QC': 'Go to C?'
            }
          )
        )
        expect(TREE.getAnswers()).toEqual([[
          'Top', 'QA'
        ]])
      })
      it('Several.', () => {
        const TREE = makeTree()
        TREE.answerQuestion('QA')
        TREE.answerQuestion('QB')
        TREE.answerQuestion('QC')
        TREE.answerQuestion('QD')
        expect(TREE.getCurrentQuestion()).toEqual(
          new Question('QD', 'MD')
        )
        expect(TREE.getAnswers()).toEqual([
          ['Top', 'QA'],
          ['QA', 'QB'],
          ['QB', 'QC'],
          ['QC', 'QD']
        ])
      })
      it('Non-existent.', () => {
        try {
          makeTree().answerQuestion('dummy_opt')
          fail('Answering a question with a non-existent answer should ' +
            'throw a NoSuchOption error.')
        } catch (error) {
          expect(error).toEqual(
                new NoSuchOption('dummy_opt', 'Top')
            )
        }
      })
    })
    describe('Reverting answers multiple times.', () => {
      it('After none.', () => {
        try {
          makeTree().revertAnswer()
          fail('Reverting answers when none has been made should raise ' +
            'an Error.')
        } catch (error) {
          expect(error).toEqual(
                new Error('No answers have been submitted.')
            )
        }
      })
      it('After one.', () => {
        const TREE = makeTree()
        TREE.answerQuestion('QA')
        TREE.revertAnswer()
        expect(TREE.getAnswers()).toEqual([])
        expect(TREE.getCurrentQuestion()).toEqual(ROOT)
      })
      it('After two.', () => {
        const TREE = makeTree()
        TREE.answerQuestion('QA')
        TREE.answerQuestion('QB')
        TREE.revertAnswer()
        expect(TREE.getCurrentQuestion()).toEqual(
          new Question('QA', 'MA',
            {
              'QB': 'Go to B?',
              'QC': 'Go to C?'
            }
          )
        )
        expect(TREE.getAnswers()).toEqual([[
          'Top', 'QA'
        ]])
        TREE.revertAnswer()
        expect(TREE.getAnswers()).toEqual([])
        expect(TREE.getCurrentQuestion()).toEqual(ROOT)
      })
    })
    it('Is valid answer.', () => {
      const TREE = makeTree()
      expect(TREE.isValidAnswer('QA')).toBe(true)
      expect(TREE.isValidAnswer('QB')).toBe(true)
      expect(TREE.isValidAnswer('QC')).toBe(true)
      expect(TREE.isValidAnswer('QD')).toBe(true)
      TREE.answerQuestion('QA')
      expect(TREE.isValidAnswer('QA')).toBe(false)
      expect(TREE.isValidAnswer('QB')).toBe(true)
      expect(TREE.isValidAnswer('QC')).toBe(true)
      expect(TREE.isValidAnswer('QD')).toBe(false)
      TREE.answerQuestion('QB')
      expect(TREE.isValidAnswer('QA')).toBe(true)
      expect(TREE.isValidAnswer('QB')).toBe(false)
      expect(TREE.isValidAnswer('QC')).toBe(true)
      expect(TREE.isValidAnswer('QD')).toBe(false)
      TREE.revertAnswer()
      expect(TREE.isValidAnswer('QA')).toBe(false)
      expect(TREE.isValidAnswer('QB')).toBe(true)
      expect(TREE.isValidAnswer('QC')).toBe(true)
      expect(TREE.isValidAnswer('QD')).toBe(false)
    })
    it('Has valid answers.', () => {
      const TREE = makeTree()
      expect(TREE.hasValidAnswers()).toBe(true)
      TREE.answerQuestion('QA')
      expect(TREE.hasValidAnswers()).toBe(true)
      TREE.answerQuestion('QB')
      expect(TREE.hasValidAnswers()).toBe(true)
      TREE.answerQuestion('QC')
      expect(TREE.hasValidAnswers()).toBe(true)
      TREE.answerQuestion('QD')
      expect(TREE.hasValidAnswers()).toBe(false)
    })
  })
})
