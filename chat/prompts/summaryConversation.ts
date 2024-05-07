import { IMessage } from '../../models/message';

export const summaryConversation = (
  messages: IMessage[]
) => `Create shot description based on messages. There must be new word (if there was), mistakes made by user, topics, user's interests, hobbies, things they like. 
About 3-5 sentences.

messages: ${JSON.stringify(
  messages.map((message) => ({
    human: message.human,
    ai: message.ai,
  }))
)}
mistakes: ${JSON.stringify(
  messages.map((message) => {
    const data: string[] = [];
    message.mistakes.forEach((mistake) => data.push(mistake.mistake));
    return data;
  })
)}

`;
