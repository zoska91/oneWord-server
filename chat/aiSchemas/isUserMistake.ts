const schemas = (languageToLearn: string) => ({
  name: 'describe_is_user_mistake',
  description: `You are english teacher. Use the provided functions to decide if you student made a mistake. User is learning new language: ${languageToLearn} and might do mistakes. Recognise if user made mistake in message`,
  parameters: {
    type: 'object',
    properties: {
      isMistake: {
        type: 'number',
        description:
          "Type has to be set to either 1 or 0: 1 for mistake, when you found a mistake in the user's message; 0 for correct, when the user's message is correct.",
      },
      mistakes: {
        type: 'array',
        description:
          'All mistakes that the user made in the message. If there are no mistakes, return an empty array. ',
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
    },
    required: ['isMistake'],
  },
});

export default schemas;
