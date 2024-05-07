import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';
import { saveLog } from '../logger';
import { IMistake, MessageModel } from '../models/message';
import { currentConversationPrompt } from '../chat/prompts/currentConversation';
import { newConversationPrompt } from '../chat/prompts/newConversation';
import { rerank } from './openai';
import { searchMemories } from '../chat/qdrant/searchMemories';

export const getPrompt = (isNewConversation: boolean, isTodayWord: boolean) => {
  const currentPrompts = isNewConversation
    ? newConversationPrompt
    : currentConversationPrompt;

  let currentPrompt = isTodayWord
    ? currentPrompts.withWord
    : currentPrompts.noWord;

  return currentPrompt;
};

export const getMemories = async (userId: string, query: string) => {
  const collectionName = `oneWord-${userId}`;
  const noQuery = 'get random memory to start conversation';
  const documents = await searchMemories(
    collectionName,
    query !== '' ? query : noQuery
  );
  if (documents.length === 0) return '';
  const memories = rerank(query, documents);

  return '';
};

export const getMessages = async ({
  query,
  conversationId,
  currentPrompt,
}: {
  query: string;
  conversationId?: string;
  currentPrompt: string;
}): Promise<(SystemMessage | HumanMessage | AIMessage)[]> => {
  const messagesHistory: (SystemMessage | HumanMessage | AIMessage)[] = [];

  if (conversationId) {
    const messageResp = await MessageModel.find({ conversationId }).lean();
    messageResp.forEach((message) => {
      messagesHistory.push(new AIMessage(message.ai));
      messagesHistory.push(new HumanMessage(message.human));
    });
  }
  console.log({ conversationId });
  // if no query and conversation - it initial message
  const messages =
    conversationId && query
      ? [
          new SystemMessage(currentPrompt),
          ...messagesHistory,
          new HumanMessage(query),
        ]
      : [new SystemMessage(currentPrompt)];

  return messages;
};

export const saveMessage = async ({
  conversationId,
  humanMessage,
  aiMessage,
  mistakes,
}: {
  conversationId: string;
  humanMessage: string;
  aiMessage: string;
  mistakes: IMistake[];
}) => {
  console.log(4, conversationId, humanMessage, aiMessage);
  const newMessage = new MessageModel({
    conversationId,
    human: humanMessage || 'initial message',
    ai: aiMessage,
    mistakes,
  });
  newMessage.save();
};
