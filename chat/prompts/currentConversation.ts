import { basePrompt } from './basePrompt';

export interface IPromptData {
  languageToLearn: string;
  memories: string;
  userName: string;
  aiName: string;
  word?: string;
  mistakes: string;
}

export const currentConversationPrompt = {
  noWord: (data: IPromptData) => `
  ${basePrompt(data)}
  Let's continue our discussion.
  `,
  withWord: (data: IPromptData) => `
    ${basePrompt(data)}
    We were talking about the word "${
      data.word
    }".  I will keep this word and prepare example, question. If I did that before prepare sentence with similar word and ask user for creating same sentence but with new word.
  `,
};
