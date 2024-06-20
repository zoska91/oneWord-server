import { describe, it, expect, beforeAll } from 'vitest';
import { CronModel } from '../../../models/cron';
import { getUserWithSettings } from '../../helpers/settings';
import app from '../../testsApp';
import { ILoggedUser } from '../../../models/user';
import { removeNotification } from '../../../utils/subscription';

describe('removeNotification Function Tests', () => {
  let user: ILoggedUser;

  beforeAll(async () => {
    user = await getUserWithSettings(app);
  });

  it('should stop and delete cron jobs for the given userId', async () => {
    await removeNotification(user.id);

    const cronJobsInDB = await CronModel.find({ userId: user.id });
    expect(cronJobsInDB).toHaveLength(0);
  });
});
