import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';

import { IMistake, INewWord } from '../models/message';
import { Response } from 'express';

export interface IPromptParams {
  aiName: string;
  userName: string;
  languageToLearn: string;
  memories: string;
  mistakes: string;
  todayWord?: string;
}

export interface ISaveMessage {
  conversationId: string;
  humanMessage: string;
  aiMessage: string;
  mistakes: IMistake[];
  newWords: INewWord[];
  userId: string;
}

export interface ISendMessageToAi {
  messages: (SystemMessage | HumanMessage | AIMessage)[];
  isStreaming?: boolean;
  conversationId: string;
  res: Response;
  query: string;
  mistakes: IMistake[];
  newWords: INewWord[];
  userId: string;
}
