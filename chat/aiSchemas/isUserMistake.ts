const schemas = (languageToLearn: string) => ({
  name: 'describe_is_user_mistake',
  description: `You are english teacher. Use the provided functions to decide if you student made a mistake. User is learning new language: ${languageToLearn} and might do mistakes. Recognise if user made Grammatical mistake or syntactic error or constituent error in message`,
  parameters: {
    type: 'object',
    properties: {
      isMistake: {
        type: 'number',
        description: `Type has to be set to either 1 or 0: 
          1 for mistake, when you found a Grammatical mistake or syntactic error or constituent error in the user's message; 
          0 for correct, when the user's message is correct.`,
      },
      isNewWord: {
        type: 'number',
        description: `Type has to be set to either 1 or 0: 
          1 when user said that is new word for them or they said they don't know some fraze/word/sentence; 
          0 when there is no information about new word/something that user doesn't understand`,
      },
      mistakes: {
        type: 'array',
        description:
          'All Grammatical mistake or syntactic error or constituent error that the user made in the message. If there are no mistakes, return an empty array. ',
        items: {
          type: 'object',
          properties: {
            mistake: {
              type: 'string',
              description:
                "What was the mistake in the user's message. If there is single word is sentence add to mistake whole sentence",
            },
            correction: {
              type: 'string',
              description: "The correction for the user's mistake.",
            },
          },
          required: ['mistake', 'correction'],
        },
      },
      newWords: {
        type: 'array',
        description: `All words/frazes/sentences that the user didn't know, didn't understand. If there are no new thing, return an empty array. `,
        items: {
          type: 'object',
          properties: {
            newWord: {
              type: 'string',
              description:
                "What was the mistake in the user's message. If there is single word is sentence add to mistake whole sentence",
            },
          },
          required: ['newWord'],
        },
      },
    },
    required: ['isMistake'],
  },
});

export default schemas;
