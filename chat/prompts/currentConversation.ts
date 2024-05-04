import { basePrompt } from './basePrompt';

export const currentConversationPrompt = {
  withWord: (memories: string, word: string) => `
    ${basePrompt('English', memories)}
    We were talking about the word "${word}". Have you come across any new contexts where you could use it? What are your thoughts on it now?
  `,
  noWord: (memories: string) => `
    ${basePrompt('English', memories)}
    Let's continue our discussion. What new insights have you gained about the topics we've been exploring together?
  `,
  withMistake: (mistake: string) =>
    `You made a mistake. The correct sentance is "${mistake}". Do you want repeat or continue?`,
};
