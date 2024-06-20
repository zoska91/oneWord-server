import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { ILoggedUser } from '../../../models/user';
import { loginUserWithAi } from '../../helpers/auth';
import {
  MessageModel,
  IMessage,
  IMistake,
  INewWord,
} from '../../../models/message';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import app from '../../testsApp';
import { getMessages } from '../../../utils/conversation';

describe('getMessages Function Tests', () => {
  let user: ILoggedUser;
  const conversationId = '123';

  beforeAll(async () => {
    user = await loginUserWithAi(app);
    const mistake1: IMistake = {
      id: 'mistake1',
      mistake: 'speling',
      correction: 'spelling',
    };

    const newWord1: INewWord = {
      id: 'newWord1',
      newWord: 'frut',
      inBaseLang: 'fruit',
    };

    const message1: Partial<IMessage> = {
      ai: 'AI response 1',
      human: 'User message 1',
      conversationId,
      userId: user.id,
      mistakes: [mistake1],
      newWords: [newWord1],
    };

    const message2: Partial<IMessage> = {
      ai: 'AI response 2',
      human: 'User message 2',
      conversationId,
      userId: user.id,
      mistakes: [],
      newWords: [],
    };

    const message3: Partial<IMessage> = {
      ai: 'AI response 2',
      human: 'User message 2',
      conversationId: '1234',
      userId: user.id,
      mistakes: [],
      newWords: [],
    };

    await new MessageModel(message1).save();
    await new MessageModel(message2).save();
    await new MessageModel(message3).save();
  });

  it('should return initial message when no query and conversationId', async () => {
    const currentPrompt = 'Welcome! Please start the conversation.';
    const result = await getMessages({ query: '', currentPrompt });

    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(SystemMessage);
    expect(result[0]).toStrictEqual(new SystemMessage(currentPrompt));
  });

  it('should return messages history for a specific conversationId', async () => {
    const currentPrompt = 'Continue the conversation.';
    const result = await getMessages({
      query: '',
      conversationId,
      currentPrompt,
    });

    expect(result.length).toBe(6); // 1 (current prompt) + 2 (messages) * 2 [human + ai] + 1 (query)
    expect(result[0]).toBeInstanceOf(SystemMessage);
    expect(result[result.length - 1]).toBeInstanceOf(HumanMessage);
  });

  it('should return messages history and query for a specific conversationId and query', async () => {
    const currentPrompt = 'Continue the conversation.';
    const query = 'User message 3';
    const result = await getMessages({ query, conversationId, currentPrompt });
    expect(result.length).toBe(6); // 1 (current prompt) + 2 (messages) * 2 [human + ai] + 1 (query)
    expect(result[0]).toBeInstanceOf(SystemMessage);
    expect(result[result.length - 2]).toBeInstanceOf(HumanMessage);
    expect(result[result.length - 1]).toStrictEqual(new HumanMessage(query));
  });
});
