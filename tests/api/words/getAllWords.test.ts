import { describe, it, expect } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { loginAndAddWords } from '../../helpers/words';

describe('GET /api/words/all Endpoint Tests', async () => {
  it('should return all words for authenticated user', async () => {
    const user = await loginAndAddWords(app);

    const res = await request(app)
      .get('/api/words/all')
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('words');
    expect(Array.isArray(res.body.words)).toBe(true);
    expect(res.body.words.length).toEqual(10);
    expect(res.body.words[0].basicWord).toEqual('dom');
    expect(res.body.words[0].transWord).toEqual('house');
    expect(res.body.words[0].addLang).toEqual(7);
    expect(res.body.words[0].status).toEqual(0);
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).get('/api/words/all');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });
});
