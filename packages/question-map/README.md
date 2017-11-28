# questionMap

## Installation.

    npm install --save questionMap

or

    yarn add questionMap

    Construct question trees:
        Question A?
            Option 1
                -   Leads to Question B.
            Option 2
                -   Leads to Question C.
            Option 3
                -   Leads to Question D.

        Question B
            Option 1
                -   Leads to question D.
            Option 2
                ...

        Question C
                ...

## Usage.

### Specifying questions.

#### Method one.

    const question = new Question('Question1', 'What do you want?',
        {
            'Question2' : 'A rock.',
            'Question3' : 'Some papers.',
            'Question4' : 'Thirty thousand scissors.'
        }
    )

    const q2 = new Question(
        ...
    )

    ...

#### Method two.

    const q1 = new Question(
      {
        'name' : 'Question1',
        'message' : 'What do you want?',
        'options' : {
              'Question2' : 'A rock.',
              'Question3' : 'Some papers.',
              'Question4' : 'Thirty thousand scissors.'
          }
      }
    )

    const q2 = new Question(
        ...
    )

    ...

### Specifying a question map.

    const QUESTIONS = new QuestionMap(
      q1, q2, ...
    )

### Going between questions.

    const QUESTIONS = ...

    while (QUESTIONS.hasValidAnswer()) {
        const question = QUESTIONS.getCurrentQuestion()
        console.log(question.fullMessage())

        let opt = getUserInput()
        while (!QUESTIONS.isValidAnswer(opt)) {
            console.log('Invalid option.')
            opt = getUserInput()
        }
        QUESTIONS.answerQuestion(opt)

        console.log(`You have answered ${QUESTIONS.getAnswers()} so far.`)
    }
