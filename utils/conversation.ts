import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';
import { v4 } from 'uuid';

import { saveLog } from '../logger';
import { IMistake, INewWord, MessageModel } from '../models/message';
import { currentConversationPrompt } from '../chat/prompts/currentConversation';
import { newConversationPrompt } from '../chat/prompts/newConversation';
import { rerank } from './openai';
import { saveMemory } from '../chat/qdrant/setData';
import { MemoriesModel } from '../models/memories';
import { searchMemories } from '../chat/qdrant/searchmemories';

export const getPrompt = (isNewConversation: boolean, isTodayWord: boolean) => {
  const currentPrompts = isNewConversation
    ? newConversationPrompt
    : currentConversationPrompt;

  let currentPrompt = isTodayWord
    ? currentPrompts.withWord
    : currentPrompts.noWord;

  return currentPrompt;
};

export const getMemories = async (
  userId: string,
  query: string,
  isNewConversation: boolean
) => {
  if (isNewConversation) {
    const memories = await MemoriesModel.find({ userId })
      .sort({ created_at: -1 })
      .limit(3)
      .lean();
    return memories.map((mem) => mem.description).join('');
  }

  const collectionName = `oneWord-${userId}`;
  const documents = await searchMemories(collectionName, query);
  if (documents.length === 0) return '';

  const memories = await rerank(query, documents);

  return memories.map((mem) => mem.content).join('');
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
  newWords,
  userId,
}: {
  conversationId: string;
  humanMessage: string;
  aiMessage: string;
  mistakes: IMistake[];
  newWords: INewWord[];
  userId: string;
}) => {
  const newMessage = new MessageModel({
    conversationId,
    human: humanMessage || 'initial message',
    ai: aiMessage,
    mistakes,
    words: newWords,
    userId,
  });
  newMessage.save();
};

export const saveSummary = async (
  summary: string,
  userId: string,
  conversationId: string
) => {
  const collectionName = `oneWord-${userId}`;
  const id = v4();
  const data = {
    id,
    content: summary,
    conversationId,
  };

  saveMemory(collectionName, [data]);

  const newMessage = new MemoriesModel({
    conversationId,
    qdrantId: id,
    description: summary,
    userId,
  });
  newMessage.save();
};
