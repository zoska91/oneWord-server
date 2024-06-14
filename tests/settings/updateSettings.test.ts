import { describe, it, expect } from 'vitest';
import request from 'supertest';

import app from '../testsApp';
import { getUserWithSettings } from '../helpers';
import { SettingsModel } from '../../models/settings';

describe('PUT /api/chat/user-settings Endpoint Tests', async () => {
  it('should update user settings for authenticated user', async () => {
    console.log(getUserWithSettings);
    const loggedInUser = await getUserWithSettings(app);
    console.log(11, loggedInUser);

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
  });

  it('should return 404 if user is not authenticated', async () => {
    const res = await request(app).put('/api/settings/user-settings');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });
});
