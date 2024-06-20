import { beforeAll, describe, expect, it } from 'vitest';
import { ILoggedUser } from '../../../models/user';
import { loginUserWithAi } from '../../helpers/auth';
import app from '../../testsApp';
import { saveSummary } from '../../../utils/conversation';
import { MemoriesModel } from '../../../models/memories';

describe('saveSummary Function Tests', () => {
  let user: ILoggedUser;

  beforeAll(async () => {
    user = await loginUserWithAi(app);
  });

  it('should save summary to MemoriesModel and call saveMemory correctly', async () => {
    const summary = 'This is a test summary';
    const conversationId = 'conversationId1';

    await saveSummary(summary, user.id, conversationId);

    const savedMemory = await MemoriesModel.findOne({
      userId: user.id,
      conversationId,
    }).lean();

    expect(savedMemory).toMatchObject({
      description: summary,
      userId: user.id,
      conversationId,
    });
  });
});
