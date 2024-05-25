const schemas = (languageToLearn: string, baseLanguage: string) => ({
  name: 'describe_is_user_mistake',
  description: `You are english teacher. Use the provided functions to decide if in message is mistake (Only grammar mistake count) or is a new word/fraze for user. User is learning new language: ${languageToLearn} and might do mistakes`,
  parameters: {
    type: 'object',
    properties: {
      isMistake: {
        type: 'number',
        description: `Type has to be set to either 1 or 0: 
          1 for mistake, when you found a grammar  mistake in message; 
          0 for correct, when the message is correct.`,
      },
      isNewWord: {
        type: 'number',
        description: `Type has to be set to either 1 or 0: 
          - 1 when user said that is new word for them or they said they don't know some fraze/word/sentence; 
          - 0 when there is no information about new word/something that user doesn't understand`,
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
            inBaseLang: {
              type: 'string',
              description: `The correction for the user's mistake in ${baseLanguage}.`,
            },
          },
          required: ['mistake', 'correction', 'inBaseLang'],
        },
      },
      newWords: {
        type: 'array',
        description: `All words/frazes/sentences that the user didn't know, didn't understand. If there are no new thing, return an empty array. If there are more that one return more that one fields in array `,
        items: {
          type: 'object',
          properties: {
            newWord: {
              type: 'string',
              description: "single fraze/sentence/word that user didn't know",
            },
            inBaseLang: {
              type: 'string',
              description: `single fraze/sentence/word that user didn't know translated to ${baseLanguage}`,
            },
          },
          required: ['newWord', 'inBaseLang'],
        },
      },
    },
    required: ['isMistake', 'isNewWord'],
  },
});

export default schemas;
