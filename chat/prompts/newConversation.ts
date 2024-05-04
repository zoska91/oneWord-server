import { basePrompt } from './basePrompt';

export const newConversationPrompt = {
  noWord: (memories: string) => `
  ${basePrompt('English', memories)}
  Let's discuss a new topic today. Based on your interests, would you like to talk about recent advancements in your favorite hobby?
  `,
  withWord: (memories: string, word: string) => `
  ${basePrompt('English', memories)}
  Today's word is "${word}". Can you make a sentence with this word? What do you think this word means?
  `,
};
