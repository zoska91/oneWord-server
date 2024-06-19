import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';
import { v4 } from 'uuid';

import { MessageModel } from '../models/message';
import { saveMemory } from '../chat/qdrant/setData';
import { MemoriesModel } from '../models/memories';
import { searchMemories } from '../chat/qdrant/searchMemories';
import { getAiAnswer, getStandaloneQuestionForMemories, rerank } from './ai';
import { IPromptParams, ISaveMessage, ISendMessageToAi } from '../chat/types';
import {
  answerTemplate,
  answerWithMistakeTemplate,
  answerWithWordTemplate,
  beginTemplate,
  beginWithWordTemplate,
} from '../chat/promptTemplates';

export const getMemories = async ({
  userId,
  query,
  isNewConversation,
  languageToLearn,
}: {
  userId: string;
  query: string;
  isNewConversation: boolean;
  languageToLearn: string;
}) => {
  if (isNewConversation) {
    const memories = await MemoriesModel.find({ userId })
      .sort({ created_at: -1 })
      .limit(3)
      .lean();

    return memories.map((mem) => mem.description).join('');
  }

  const collectionName = `oneWord-${userId}`;
  const standaloneQuestion = await getStandaloneQuestionForMemories(
    query,
    languageToLearn
  );
  const documents = await searchMemories(collectionName, standaloneQuestion);

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

export const getPrompt = (
  isNewConversation: boolean,
  promptParams: IPromptParams
) => {
  const isTodayWord = Boolean(promptParams.todayWord);
  const mistakesString =
    typeof promptParams.mistakes === 'string'
      ? promptParams.mistakes
      : JSON.stringify(promptParams.mistakes);

  const newPromptParams = {
    ...promptParams,
    mistakes: mistakesString,
  };

  if (
    promptParams.mistakes &&
    Array.isArray(promptParams.mistakes) &&
    promptParams.mistakes.length > 0
  )
    return answerWithMistakeTemplate(newPromptParams);

  if (isNewConversation && !isTodayWord) return beginTemplate(newPromptParams);
  if (!isNewConversation && !isTodayWord)
    return answerTemplate(newPromptParams);

  if (isNewConversation && isTodayWord)
    return beginWithWordTemplate(newPromptParams);
  if (!isNewConversation && isTodayWord)
    return answerWithWordTemplate(newPromptParams);

  return '';
};

export const saveMessage = async ({
  conversationId,
  humanMessage,
  aiMessage,
  mistakes,
  newWords,
  userId,
}: ISaveMessage) => {
  const newMessage = new MessageModel({
    conversationId,
    human: humanMessage || 'initial message',
    ai: aiMessage,
    mistakes,
    newWords,
    userId,
  });

  newMessage.save();
};

export const sendMessageToAi = async ({
  messages,
  isStreaming,
  conversationId,
  res,
  query,
  mistakes,
  newWords,
  userId,
}: ISendMessageToAi) => {
  const dataToSave = {
    conversationId,
    humanMessage: query,
    mistakes,
    newWords,
    userId,
  };

  await getAiAnswer({ res, messages, isStreaming, saveMessage, dataToSave });
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
