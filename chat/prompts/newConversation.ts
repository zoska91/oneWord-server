import { basePrompt } from './basePrompt';

export const newConversationPrompt = {
  noWord: (memories: string) => `
  ${basePrompt('English', memories)}
  This is the new conversation and you should start it. 
  Let's discuss a new topic today. Based on your interests, interesting facts, previous mistakes, etc.
  `,
  withWord: (memories: string, word: string) => `
  ${basePrompt('English', memories)}
  Today's word is "${word}". Prepare a sentence with that word and send it to user. Ask him if they understand it and it they want to explanation or create their own sentence
  `,
};
