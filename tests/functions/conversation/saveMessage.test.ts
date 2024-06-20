import { beforeAll, describe, expect, it } from 'vitest';
import { ISaveMessage } from '../../../chat/types';
import { saveMessage } from '../../../utils/conversation';
import { MessageModel } from '../../../models/message';
import { ILoggedUser } from '../../../models/user';
import { loginUserWithAi } from '../../helpers/auth';
import app from '../../testsApp';

describe('saveMessage Function Tests', () => {
  let user: ILoggedUser;

  beforeAll(async () => {
    user = await loginUserWithAi(app);
  });

  it('should save a message with all fields correctly', async () => {
    const saveMessageParams: ISaveMessage = {
      conversationId: 'conversationId1',
      humanMessage: 'Hello!',
      aiMessage: 'Hi there!',
      mistakes: [{ id: '1', mistake: 'typo', correction: 'correction' }],
      newWords: [{ id: '1', newWord: 'neologism', inBaseLang: 'English' }],
      userId: user.id,
    };

    await saveMessage(saveMessageParams);

    const savedMessage = await MessageModel.findOne({
      conversationId: 'conversationId1',
    }).lean();

    expect(savedMessage).toMatchObject({
      human: 'Hello!',
      ai: 'Hi there!',
      conversationId: 'conversationId1',
      mistakes: [{ id: '1', mistake: 'typo', correction: 'correction' }],
      newWords: [{ id: '1', newWord: 'neologism', inBaseLang: 'English' }],
      userId: user.id,
    });
  });
});
