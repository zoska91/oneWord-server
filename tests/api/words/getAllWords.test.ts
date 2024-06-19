import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { loginAndAddWords } from '../../helpers/words';
import { ModelName, cleanAll } from '../../helpers/cleaner';

describe('GET /api/words/all Endpoint Tests', async () => {
  beforeAll(async () => {
    await cleanAll([
      ModelName.UserModel,
      ModelName.UserModel,
      ModelName.SubscriptionModel,
    ]);
  });

  it('should return all words for authenticated user', async () => {
    const user = await loginAndAddWords(app);

    const res = await request(app)
      .get('/api/words/all')
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('words');
    expect(Array.isArray(res.body.words)).toBe(true);
    expect(res.body.words.length).toEqual(10);
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).get('/api/words/all');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });
});
