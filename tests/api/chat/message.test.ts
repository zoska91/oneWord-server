import { describe, it, expect } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

import app from '../../testsApp';
import { MAX_LENGTH_LANGUAGE_TO_LEARN } from '../../../validation/helpers';
import { loginRegularUser, loginUserWithAi } from '../../helpers/auth';

let mongoServer: MongoMemoryServer;

describe('POST /api/chat/message', () => {
  it('should send a message when user is authenticated and is not an AI', async () => {
    const user = await loginRegularUser(app);

    const res = await request(app)
      .post('/api/chat/message')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        query: 'Hello',
        languageToLearn: 'Spanish',
        isStreaming: false,
        todayWord: 'Hola',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 500 if languageToLearn is missing', async () => {
    const user = await loginUserWithAi(app);

    const res = await request(app)
      .post('/api/chat/message')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        query: 'Hello',
        isStreaming: false,
        todayWord: 'Hola',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.languageToLearn is a required field'
    );
  });

  it('should return 500 if languageToLearn exceeds maximum length', async () => {
    const longLanguage = 'a'.repeat(MAX_LENGTH_LANGUAGE_TO_LEARN + 1);
    const user = await loginUserWithAi(app);

    const res = await request(app)
      .post('/api/chat/message')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        query: 'Hello',
        languageToLearn: longLanguage,
        isStreaming: false,
        todayWord: 'Hola',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      `body.languageToLearn must be at most ${MAX_LENGTH_LANGUAGE_TO_LEARN} characters`
    );
  });

  it('should return 500 if query exceeds maximum length', async () => {
    const longQuery = 'a'.repeat(1025);

    const user = await loginUserWithAi(app);

    const res = await request(app)
      .post('/api/chat/message')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        query: longQuery,
        languageToLearn: 'Spanish',
        isStreaming: false,
        todayWord: 'Hola',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.query must be at most 1024 characters'
    );
  });
});
