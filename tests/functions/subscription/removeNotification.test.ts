import { describe, it, beforeAll, expect } from 'vitest';
import {
  getExtraUserWithSettings,
  getUserWithSettings,
} from '../../helpers/settings';
import app from '../../testsApp';
import { ILoggedUser } from '../../../models/user';
import {
  removeNotification,
  scheduleNotification,
} from '../../../utils/subscription';
import cron from 'node-cron';
import { CronModel } from '../../../models/cron';

describe('removeNotification Function Tests', () => {
  let user: ILoggedUser;
  let extraUser: ILoggedUser;

  beforeAll(async () => {
    user = await getUserWithSettings(app);
    extraUser = await getExtraUserWithSettings(app);
  });

  it('should stop and delete cron jobs for the given userId', async () => {
    await scheduleNotification(user.id);
    const cronJobsInDBBefore = await CronModel.find({ userId: user.id });
    const activeCronTasksBefore = Array.from(cron.getTasks()).filter(
      ([name, task]) => name.includes(user.id)
    );
    expect(cronJobsInDBBefore).toHaveLength(3);
    expect(activeCronTasksBefore).toHaveLength(3);

    await removeNotification(user.id);
    const cronJobsInDBAfter = await CronModel.find({ userId: user.id });

    const activeCronTasksAfter = Array.from(cron.getTasks()).filter(
      // task is stop when timeout is null
      // @ts-ignore
      ([name, task]) => name.includes(user.id) && task._scheduler.timeout
    );

    expect(cronJobsInDBAfter).toHaveLength(0);
    expect(activeCronTasksAfter).toHaveLength(0);
  });

  it('should stop and delete cron jobs only for the given userId', async () => {
    await scheduleNotification(user.id);
    await scheduleNotification(extraUser.id);

    // get before for regular user
    const cronJobsInDBBeforeRegularUser = await CronModel.find({
      userId: user.id,
    });
    const activeCronTasksBeforeRegularUser = Array.from(cron.getTasks()).filter(
      ([name, task]) => name.includes(user.id)
    );

    // get before for extra user
    const cronJobsInDBBeforeExtraUser = await CronModel.find({
      userId: user.id,
    });
    const activeCronTasksBeforeExtraUser = Array.from(cron.getTasks()).filter(
      ([name, task]) => name.includes(user.id)
    );
    expect(cronJobsInDBBeforeRegularUser).toHaveLength(3);
    expect(activeCronTasksBeforeRegularUser).toHaveLength(3);
    expect(cronJobsInDBBeforeExtraUser).toHaveLength(3);
    expect(activeCronTasksBeforeExtraUser).toHaveLength(3);

    // remove for extra user
    await removeNotification(extraUser.id);

    const cronJobsInDBRegularUserAfter = await CronModel.find({
      userId: user.id,
    });
    const cronJobsInDBExtraUserAfter = await CronModel.find({
      userId: extraUser.id,
    });

    expect(cronJobsInDBRegularUserAfter).toHaveLength(3);
    expect(cronJobsInDBExtraUserAfter).toHaveLength(0);

    const activeCronTasksRegularUserAfter = Array.from(cron.getTasks()).filter(
      // task is stop when timeout is null
      // @ts-ignore
      ([name, task]) => name.includes(user.id) && task._scheduler.timeout
    );
    const activeCronTasksExtraUserAfter = Array.from(cron.getTasks()).filter(
      // task is stop when timeout is null
      // @ts-ignore
      ([name, task]) => name.includes(extraUser.id) && task._scheduler.timeout
    );

    expect(activeCronTasksRegularUserAfter).toHaveLength(3);
    expect(activeCronTasksExtraUserAfter).toHaveLength(0);

    const offCronTasksRegularUserAfter = Array.from(cron.getTasks()).filter(
      // task is stop when timeout is null
      // @ts-ignore
      ([name, task]) => name.includes(user.id) && !task._scheduler.timeout
    );
    const offCronTasksExtraUserAfter = Array.from(cron.getTasks()).filter(
      // task is stop when timeout is null
      // @ts-ignore
      ([name, task]) => name.includes(extraUser.id) && !task._scheduler.timeout
    );

    expect(offCronTasksRegularUserAfter).toHaveLength(0);
    expect(offCronTasksExtraUserAfter).toHaveLength(3);
  });
});
