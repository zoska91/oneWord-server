import { IMessage } from '../../models/message';

export const summaryConversation = ({
  messages,
  userName,
  aiName,
}: {
  messages: IMessage[];
  userName: string;
  aiName: string;
}) => `
I am  ${aiName} and will prepare summaries about our conversation based on messages, mistakes and words. 
These summaries should focus on key points such as ${userName}'s questions, new vocabulary introduced, and any clear preferences or dislikes expressed by the ${userName} regarding the conversation topics. The goal is to store these summaries in a database as "memories" to enhance future interactions with ${userName}, avoiding repetitive discussions and ensuring relevance.

### Instructions for me:
- Review the conversation for any errors, new terms learned, and any specific likes or dislikes expressed by the user about the content.
- Create a summary that includes the main topic of the conversation, any new words or concepts discussed, and any specific user feedback (like or dislike).
- Ensure the tone is neutral and the summary is concise, intended solely for archival purposes to aid in future personalized user interactions.
- Avoid including assumed interests or topics not explicitly discussed in the conversation. 

### Context:
messages: ${JSON.stringify(
  messages.map((message) => ({
    human: message.human,
    ai: message.ai,
  }))
)}
mistakes: ${JSON.stringify(
  messages.map((message) => {
    const data: string[] = [];
    message.mistakes?.forEach((mistake) => data.push(mistake.mistake));
    return data;
  })
)}
new words: ${JSON.stringify(
  messages.map((message) => {
    const data: string[] = [];
    message.newWords?.forEach((newWord) => data.push(newWord.newWord));
    return data;
  })
)}

`;
