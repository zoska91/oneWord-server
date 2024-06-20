import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { MemoriesModel } from '../../../models/memories';
import app from '../../testsApp';
import { ILoggedUser } from '../../../models/user';
import { getMemories } from '../../../utils/conversation';
import { loginUserWithAi } from '../../helpers/auth';

describe('getMemories Function Tests', () => {
  let user: ILoggedUser;

  beforeAll(async () => {
    user = await loginUserWithAi(app);
  });

  beforeEach(async () => {
    await MemoriesModel.deleteMany({});

    const now = new Date();
    await MemoriesModel.create([
      {
        userId: user.id,
        description: 'Memory 1',
        created_at: new Date(now.getTime() - 1000),
        conversationId: 'conv1',
        qdrantId: 'qd1',
      },
      {
        userId: user.id,
        description: 'Memory 2',
        created_at: new Date(now.getTime() - 2000),
        conversationId: 'conv2',
        qdrantId: 'qd2',
      },
      {
        userId: user.id,
        description: 'Memory 3',
        created_at: new Date(now.getTime() - 3000),
        conversationId: 'conv3',
        qdrantId: 'qd3',
      },
      {
        userId: user.id,
        description: 'Memory 4',
        created_at: new Date(now.getTime() - 4000),
        conversationId: 'conv4',
        qdrantId: 'qd4',
      },
    ]);
  });

  it('should return the descriptions of the latest 3 memories for a new conversation', async () => {
    const result = await getMemories({
      userId: user.id,
      query: '',
      isNewConversation: true,
      languageToLearn: 'English',
    });

    expect(result).toBe('Memory 1\nMemory 2\nMemory 3');
  });
});
