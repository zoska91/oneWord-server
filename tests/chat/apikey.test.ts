import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { loginUserNoAi, loginUserWithAi } from '../helpers';

import app from '../testsApp';

describe('GET /api/chat/api-key', async () => {
  it('should return API key when user is authenticated and is an AI', async () => {
    const user = await loginUserWithAi(app);

    const res = await request(app)
      .get('/api/chat/api-key')
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe('string');
    expect(res.body).equal('exampleApiKey');
  });

  it('should return 404 if user is not authenticated', async () => {
    const res = await request(app).get('/api/chat/api-key');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 404 if user is authenticated but not an AI', async () => {
    const user = await loginUserNoAi(app);

    const res = await request(app)
      .get('/api/chat/api-key')
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });
});
