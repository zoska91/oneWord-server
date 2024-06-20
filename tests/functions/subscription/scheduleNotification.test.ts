import { expect } from 'chai';
import { beforeAll, describe, it } from 'vitest';
import app from '../../testsApp';
import { getUserWithSettings } from '../../helpers/settings';
import { ILoggedUser } from '../../../models/user';
import { scheduleNotification } from '../../../utils/subscription';
import { CronModel } from '../../../models/cron';
import mongoose from 'mongoose';

describe('scheduleNotification Function Tests', () => {
  let user: ILoggedUser;

  beforeAll(async () => {
    user = await getUserWithSettings(app);
  });

  it('should schedule notifications based on user settings', async () => {
    await scheduleNotification(user.id);
    const cronJobs = await CronModel.find({ userId: user.id });

    expect(cronJobs).to.have.lengthOf(3);

    const cronJobTimes = cronJobs.map((job) => job.time);
    expect(cronJobTimes).to.include.members(['12:42', '14:42', '16:42']);
  });

  it('should handle case when user settings do not exist', async () => {
    const nonExistingUserId = new mongoose.Types.ObjectId();

    await scheduleNotification(nonExistingUserId.toString());

    const cronJobs = await CronModel.find({ userId: nonExistingUserId });

    expect(cronJobs).to.have.lengthOf(0);
  });
});
