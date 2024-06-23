import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { ILoggedUser } from '../../../models/user';
import { getUserWithLearnedWords } from '../../helpers/words';
import { ModelName, cleanAll } from '../../helpers/cleaner';

describe('GET /api/words/learned-words Endpoint Tests', () => {
  let user: ILoggedUser;
  let token: string;

  beforeAll(async () => {
    await cleanAll([
      ModelName.UserModel,
      ModelName.UserModel,
      ModelName.SubscriptionModel,
    ]);
    user = await getUserWithLearnedWords(app);
    token = user.token;
  });

  it('should fetch learned words with valid parameters', async () => {
    const res = await request(app)
      .get('/api/words/learned-words')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 10 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.words).toBeDefined();
    expect(res.body.words).toBeInstanceOf(Array);
    expect(res.body.words.length).equal(10);
    expect(res.body.words[0].basicWord).toEqual('dom');
    expect(res.body.words[0].transWord).toEqual('house');
    expect(res.body.words[0].userId).toEqual(user.id.toString());
    expect(res.body.words[0].status).toEqual(2);
  });

  it('should fetch learned words filtered by days', async () => {
    const res = await request(app)
      .get('/api/words/learned-words')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 10, days: 3 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.words).toBeDefined();
    expect(res.body.words).toBeInstanceOf(Array);
    expect(res.body.words.length).equal(3);
    expect(res.body.words[0].basicWord).toEqual('dom');
    expect(res.body.words[0].transWord).toEqual('house');
    expect(res.body.words[0].userId).toEqual(user.id.toString());
    expect(res.body.words[0].status).toEqual(2);
  });

  it('should return 401 if no user is logged in', async () => {
    const res = await request(app)
      .get('/api/words/learned-words')
      .query({ limit: 2 });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 400 if invalid query parameters are provided', async () => {
    const res = await request(app)
      .get('/api/words/learned-words')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 'invalid', days: 'invalid' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(
      'query.days must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).'
    );
  });

  it('should return 400 if limit is not a number', async () => {
    const res = await request(app)
      .get('/api/words/learned-words')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 'invalid', days: 3 });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'query.limit must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).'
    );
  });

  it('should return 400 if days is not a number', async () => {
    const res = await request(app)
      .get('/api/words/learned-words')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 10, days: 'invalid' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'query.days must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).'
    );
  });

  it('should fetch learned words with only limit parameter provided', async () => {
    const res = await request(app)
      .get('/api/words/learned-words')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 3 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.words).toBeDefined();
    expect(res.body.words).toBeInstanceOf(Array);
    expect(res.body.words.length).toEqual(3);
    expect(res.body.words[0].basicWord).toEqual('dom');
    expect(res.body.words[0].transWord).toEqual('house');
    expect(res.body.words[0].userId).toEqual(user.id.toString());
    expect(res.body.words[0].status).toEqual(2);
  });

  it('should return 400 if limit is missing and days is provided', async () => {
    const res = await request(app)
      .get('/api/words/learned-words')
      .set('Authorization', `Bearer ${token}`)
      .query({ days: 2 });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('query.limit is a required field');
  });
});
