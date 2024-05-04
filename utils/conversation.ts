import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';
import { saveLog } from '../logger';
import { MessageModel } from '../models/message';
import { currentConversationPrompt } from '../chat/prompts/currentConversation';
import { newConversationPrompt } from '../chat/prompts/newConversation';

export const getPrompt = (isNewConversation: boolean, isTodayWord: boolean) => {
  const currentPrompts = isNewConversation
    ? newConversationPrompt
    : currentConversationPrompt;
  let currentPrompt = isTodayWord
    ? currentPrompts.withWord
    : currentPrompts.noWord;

  return currentPrompt;
};

export const getMemories = (userId: string) => {
  // get data from qdrant `memoried_${userId}`
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
  const messagesHistory = Boolean(conversationId)
    ? (await MessageModel.find({ conversationId }).lean()).map((message) => {
        if (message.human) return new HumanMessage(message.human);
        else return new AIMessage(message.ai);
      })
    : [];

  const messages = [
    new SystemMessage(currentPrompt),
    ...messagesHistory,
    new HumanMessage(query),
  ];

  return messages;
};

export const saveMessage = async ({
  conversationId,
  humanMessage,
  aiMessage,
}: {
  conversationId: string;
  humanMessage: string;
  aiMessage: string;
}) => {
  const newMessage = new MessageModel({
    conversationId,
    human: humanMessage,
    ai: aiMessage,
  });
  newMessage.save();
};
