import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { loginRegularUser } from '../../helpers/auth';
import { ILoggedUser } from '../../../models/user';

describe('GET /api/subscription/vapidPublicKey Endpoint Tests', async () => {
  let user: ILoggedUser;

  beforeAll(async () => {
    user = await loginRegularUser(app);
  });

  it('should return VAPID public key for authenticated user', async () => {
    const res = await request(app)
      .get('/api/subscription/vapidPublicKey')
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBe(process.env.VAPID_PUBLIC_KEY);
  });

  it('should return 401 if no logged user', async () => {
    const res = await request(app).get('/api/subscription/vapidPublicKey');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 401 if invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/subscription/vapidPublicKey')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });
});
