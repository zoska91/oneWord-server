import { basePrompt } from './basePrompt';
import { IPromptData } from './currentConversation';

export const newConversationPrompt = {
  noWord: (data: IPromptData) => `
  ${basePrompt(data)}
  This is the new conversation and I should start it. Say hello to ${
    data.userName
  } and start new topic. Based on ${
    data.userName
  }'s interests, hobbies, interesting facts, previous mistakes, etc.
  `,
  withWord: (data: IPromptData) => `
  ${basePrompt(data)}
  Today's word is "${
    data.word
  }". Prepare a sentence with that word and send it to ${data.userName}. Ask ${
    data.userName
  } if ${data.userName} understand it and if ${
    data.userName
  } wants to explanation or create their own sentence
  `,
};
