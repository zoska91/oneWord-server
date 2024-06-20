import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import cron from 'node-cron';

import app from '../../testsApp';
import { getUserWithSettings } from '../../helpers/settings';
import { ILoggedUser } from '../../../models/user';
import { scheduleNotification } from '../../../utils/subscription';
import { CronModel } from '../../../models/cron';
import { defaultNotification } from '../../../models/settings';

describe('scheduleNotification Function Tests', () => {
  let user: ILoggedUser;

  beforeAll(async () => {
    user = await getUserWithSettings(app);
  });

  it('should schedule notifications based on user settings', async () => {
    await scheduleNotification(user.id);
    const cronJobs = await CronModel.find({ userId: user.id });

    const activeCronTasks = Array.from(cron.getTasks()).filter(([name, task]) =>
      name.includes(user.id)
    );

    expect(cronJobs).toHaveLength(3);
    expect(activeCronTasks).toHaveLength(3);

    const cronJobTimes = cronJobs.map((job) => job.time);
    expect(cronJobTimes).to.include.members(['12:42', '14:42', '16:42']);
  });

  it('should handle case when user settings do not exist', async () => {
    const nonExistingUserId = new mongoose.Types.ObjectId();

    await scheduleNotification(nonExistingUserId.toString());

    const cronJobs = await CronModel.find({ userId: nonExistingUserId });
    const activeCronTasks = Array.from(cron.getTasks()).filter(([name, task]) =>
      name.includes(nonExistingUserId.toString())
    );

    expect(activeCronTasks).toHaveLength(0);
    expect(cronJobs).toHaveLength(0);
  });

  it('should stop and delete old cron jobs for the given userId and start new ones', async () => {
    await scheduleNotification(user.id);
    const cronJobsInDBBefore = await CronModel.find({ userId: user.id });
    const activeCronTasksBefore = Array.from(cron.getTasks()).filter(
      // task is stop when timeout is null
      // @ts-ignore
      ([name, task]) => name.includes(user.id) && task._scheduler.timeout
    );
    expect(cronJobsInDBBefore).toHaveLength(3);
    expect(activeCronTasksBefore).toHaveLength(3);

    const updatedNotifications = {
      notifications: [
        { time: '09:00', type: '2' },
        { time: '13:00', type: '2' },
      ],
    };

    const res = await request(app)
      .put('/api/settings/user-settings')
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedNotifications);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Update success');

    const activeCronTasksAfter = Array.from(cron.getTasks()).filter(
      // task is stop when timeout is null
      // @ts-ignore
      ([name, task]) => name.includes(user.id) && task._scheduler.timeout
    );

    const isFirstNewNotification = Array.from(cron.getTasks()).filter(
      // task is stop when timeout is null
      ([name, task]) =>
        name.includes(user.id) &&
        // @ts-ignore
        task._scheduler.timeout &&
        name.includes(updatedNotifications.notifications[0].time)
    );
    const isNotFirstOldNotification = Array.from(cron.getTasks()).filter(
      // task is stop when timeout is null
      ([name, task]) =>
        name.includes(user.id) &&
        // @ts-ignore
        task._scheduler.timeout &&
        name.includes(defaultNotification[0].time)
    );
    console.log(cron.getTasks());

    expect(activeCronTasksAfter).toHaveLength(2);
    expect(isFirstNewNotification).toHaveLength(1);
    expect(isNotFirstOldNotification).toHaveLength(0);
  });
});
