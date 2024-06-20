import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { SettingsModel } from '../../../models/settings';
import { getUserWithSettings } from '../../helpers/settings';
import { ILoggedUser } from '../../../models/user';
import { CronModel } from '../../../models/cron';

describe('PUT /api/chat/user-settings Endpoint Tests', async () => {
  let loggedInUser: ILoggedUser;

  beforeAll(async () => {
    loggedInUser = await getUserWithSettings(app);
  });

  it('should update user settings for authenticated user', async () => {
    const updatedSettings = {
      breakDay: 2,
      isBreak: false,
      isSummary: true,
      summaryDay: 5,
      notifications: [
        { time: '08:00', type: '1' },
        { time: '12:00', type: '1' },
        { time: '18:00', type: '1' },
      ],
      languageToLearn: 3,
      baseLanguage: 1,
    };

    const res = await request(app)
      .put('/api/settings/user-settings')
      .set('Authorization', `Bearer ${loggedInUser.token}`)
      .send(updatedSettings);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Update success');

    const settingsInDB = await SettingsModel.findOne({
      userId: loggedInUser.id,
    });

    if (!settingsInDB) throw new Error('No settings');

    expect(settingsInDB).toBeTruthy();
    expect(settingsInDB.breakDay).toEqual(updatedSettings.breakDay);
    expect(settingsInDB.isBreak).toEqual(updatedSettings.isBreak);
    expect(settingsInDB.isSummary).toEqual(updatedSettings.isSummary);
    expect(settingsInDB.summaryDay).toEqual(updatedSettings.summaryDay);
    expect(settingsInDB.notifications[0].time).toEqual(
      updatedSettings.notifications[0].time
    );
    expect(settingsInDB.notifications[0].type).toEqual(
      updatedSettings.notifications[0].type
    );
    expect(settingsInDB.notifications[1].time).toEqual(
      updatedSettings.notifications[1].time
    );
    expect(settingsInDB.notifications[1].type).toEqual(
      updatedSettings.notifications[1].type
    );
    expect(settingsInDB.notifications[2].time).toEqual(
      updatedSettings.notifications[2].time
    );
    expect(settingsInDB.notifications[2].type).toEqual(
      updatedSettings.notifications[2].type
    );
    expect(settingsInDB.languageToLearn).toEqual(
      updatedSettings.languageToLearn
    );
    expect(settingsInDB.baseLanguage).toEqual(updatedSettings.baseLanguage);

    const cronJobs = await CronModel.find({ userId: loggedInUser.id });
    expect(cronJobs).toHaveLength(3);

    const cronJobTimes = cronJobs.map((job) => job.time);
    expect(cronJobTimes).toEqual(
      expect.arrayContaining(['08:00', '12:00', '18:00'])
    );
  });

  it('should return 404 if user is not authenticated', async () => {
    const res = await request(app).put('/api/settings/user-settings');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should update notifications only for authenticated user', async () => {
    const updatedNotifications = {
      notifications: [
        { time: '09:00', type: '2' },
        { time: '13:00', type: '2' },
      ],
    };

    const res = await request(app)
      .put('/api/settings/user-settings')
      .set('Authorization', `Bearer ${loggedInUser.token}`)
      .send(updatedNotifications);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Update success');

    const settingsInDB = await SettingsModel.findOne({
      userId: loggedInUser.id,
    });

    if (!settingsInDB) throw new Error('No settings');

    expect(settingsInDB.notifications.length).toEqual(
      updatedNotifications.notifications.length
    );
    expect(settingsInDB.notifications[0].time).toEqual(
      updatedNotifications.notifications[0].time
    );
    expect(settingsInDB.notifications[0].type).toEqual(
      updatedNotifications.notifications[0].type
    );
    expect(settingsInDB.notifications[1].time).toEqual(
      updatedNotifications.notifications[1].time
    );
    expect(settingsInDB.notifications[1].type).toEqual(
      updatedNotifications.notifications[1].type
    );

    const cronJobs = await CronModel.find({ userId: loggedInUser.id });
    expect(cronJobs).toHaveLength(2);
    const cronJobTimes = cronJobs.map((job) => job.time);
    expect(cronJobTimes).toEqual(expect.arrayContaining(['09:00', '13:00']));
  });

  it('should update only status fields for authenticated user', async () => {
    const updatedStatus = {
      isBreak: true,
      isSummary: false,
    };

    const res = await request(app)
      .put('/api/settings/user-settings')
      .set('Authorization', `Bearer ${loggedInUser.token}`)
      .send(updatedStatus);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Update success');

    const settingsInDB = await SettingsModel.findOne({
      userId: loggedInUser.id,
    });

    if (!settingsInDB) throw new Error('No settings');

    expect(settingsInDB.isBreak).toEqual(updatedStatus.isBreak);
    expect(settingsInDB.isSummary).toEqual(updatedStatus.isSummary);
  });
});
