import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { WordModel } from '../../../models/word';
import { loginRegularUser } from '../../helpers/auth';
import { MAX_LENGTH_TODAY_WORD } from '../../../validation/helpers';
import { ILoggedUser } from '../../../models/user';
import { ModelName, cleanAll } from '../../helpers/cleaner';

describe('POST /api/words/add-one Endpoint Tests', async () => {
  let user: ILoggedUser;
  const mockWordData = { basicWord: 'house', transWord: 'dom', addLang: 7 };

  beforeAll(async () => {
    await cleanAll([
      ModelName.UserModel,
      ModelName.UserModel,
      ModelName.SubscriptionModel,
    ]);

    user = await loginRegularUser(app);
  });

  it('should add a new word for authenticated user with valid data', async () => {
    const mockWordData = { basicWord: 'house', transWord: 'dom', addLang: 7 };

    const res = await request(app)
      .post('/api/words/add-one')
      .set('Authorization', `Bearer ${user.token}`)
      .send(mockWordData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Success' });

    const savedWord = await WordModel.findOne({ userId: user.id });
    if (!savedWord) throw Error('no word');

    expect(savedWord).toBeTruthy();
    expect(savedWord.basicWord).toEqual(mockWordData.basicWord);
    expect(savedWord.transWord).toEqual(mockWordData.transWord);
    expect(savedWord.addLang).toEqual(mockWordData.addLang);
  });

  it('should return 401 if no logged user', async () => {
    const res = await request(app)
      .post('/api/words/add-one')
      .send(mockWordData);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 400 if basicWord is missing', async () => {
    const res = await request(app)
      .post('/api/words/add-one')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        transWord: 'dom',
        addLang: 7,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'body.basicWord is a required field'
    );
  });

  it('should return 400 if transWord is missing', async () => {
    const res = await request(app)
      .post('/api/words/add-one')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        basicWord: 'hello',
        addLang: 7,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'body.transWord is a required field'
    );
  });

  it('should return 400 if addLang is missing', async () => {
    const res = await request(app)
      .post('/api/words/add-one')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        basicWord: 'hello',
        transWord: 'hola',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'body.addLang is a required field'
    );
  });

  it('should return 400 if basicWord exceeds max length', async () => {
    const longWord = 'a'.repeat(MAX_LENGTH_TODAY_WORD + 1);
    const res = await request(app)
      .post('/api/words/add-one')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        basicWord: longWord,
        transWord: 'hola',
        addLang: 7,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      `body.basicWord must be at most ${MAX_LENGTH_TODAY_WORD} characters`
    );
  });

  it('should return 400 if transWord exceeds max length', async () => {
    const longWord = 'a'.repeat(MAX_LENGTH_TODAY_WORD + 1);
    const res = await request(app)
      .post('/api/words/add-one')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        basicWord: 'hello',
        transWord: longWord,
        addLang: 7,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      `body.transWord must be at most ${MAX_LENGTH_TODAY_WORD} characters`
    );
  });
});
