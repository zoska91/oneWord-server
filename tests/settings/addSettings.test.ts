import { describe, it, expect } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../testsApp';
import { UserModel } from '../../models/user';
import { AvailableLanguages } from '../../enums/languages';

describe('Registration, Login, and User Settings Endpoint Tests', async () => {
  it('should register a new user and create default settings', async () => {
    const username = 'testuser';
    const password = 'testpassword';

    // Register a new user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ username, password });

    expect(registerRes.statusCode).toEqual(200);
    expect(registerRes.body).toHaveProperty('message', 'success');

    // Log in the registered user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username, password });

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('token');
    const authToken = loginRes.body.token;

    // Fetch the registered user data
    const registeredUser = await UserModel.findOne({ username });

    // Check if user has been registered
    expect(registeredUser).toBeTruthy();

    // Fetch settings for the registered user
    const settingsRes = await request(app)
      .get('/api/settings/user-settings')
      .set('Authorization', `Bearer ${authToken}`);

    expect(settingsRes.statusCode).toEqual(200);
    expect(settingsRes.body).toHaveProperty(
      'userId',
      registeredUser?._id.toString()
    );
    expect(settingsRes.body).toHaveProperty('breakDay', 7);
    expect(settingsRes.body).toHaveProperty('isBreak', true);
    expect(settingsRes.body).toHaveProperty('isSummary', true);
    expect(settingsRes.body).toHaveProperty('summaryDay', 1);
    expect(settingsRes.body).toHaveProperty('notifications');
    expect(settingsRes.body).toHaveProperty(
      'languageToLearn',
      AvailableLanguages.en
    );
    expect(settingsRes.body).toHaveProperty(
      'baseLanguage',
      AvailableLanguages.pl
    );
  });

  it('should return 404 if attempting to fetch settings without authentication', async () => {
    const res = await request(app).get('/api/settings/user-settings');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });
});
