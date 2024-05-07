import { basePrompt } from './basePrompt';

export const currentConversationPrompt = {
  withWord: (memories: string, word: string) => `
    ${basePrompt('English', memories)}
    We were talking about the word "${word}". try to keep this word and prepare example, question. If you did that before prepare sentence with similar word and ask user for creating same sentnce but with new word.
  `,
  noWord: (memories: string) => `
    ${basePrompt('English', memories)}
    Let's continue our discussion.
  `,
  withMistake: (mistake: string) =>
    `You made a mistake. The correct sentance is "${mistake}". Do you want repeat or continue?`,
};
