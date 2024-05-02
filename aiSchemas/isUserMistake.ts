const schemas = (languageToLearn: string) => ({
  name: 'describe_is_user_mistake',
  description: `You are english teacher. Use the provided functions to decide if you student made a mistake. User is learning new language: ${languageToLearn} and might do mistakes. Recognise if user made mistake in message`,
  parameters: {
    type: 'object',
    properties: {
      isMistake: {
        type: 'number',
        description: `
          Type has to be set to either 1 or 0:
          0: mistake — when you found mistake in user message.
          1: correct — when user message is correct.
        `,
      },
      answer: {
        type: 'string',
        description: `
          if user made mistake in message, you have to correct it and send back to user.
          If message is correct leave it empty
        `,
      },
    },
    required: ['category', 'type'],
  },
});

export default schemas;
