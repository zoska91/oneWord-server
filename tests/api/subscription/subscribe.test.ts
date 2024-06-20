import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { SubscriptionModel } from '../../../models/subscription';
import { loginRegularUser } from '../../helpers/auth';
import { ModelName, cleanAll } from '../../helpers/cleaner';
import { ILoggedUser } from '../../../models/user';

describe('POST /api/subscription/subscribe Endpoint Tests', async () => {
  let user: ILoggedUser;
  let mockSubscriptionData;

  beforeAll(async () => {
    await cleanAll([ModelName.UserModel, ModelName.SubscriptionModel]);

    user = await loginRegularUser(app);
    mockSubscriptionData = {
      subscription: {
        endpoint: 'https://example.com',
        keys: {
          p256dh: 'p256dhKey',
          auth: 'authKey',
        },
      },
      userId: user.id,
    };
  });

  it('should subscribe for authenticated user with valid data', async () => {
    const res = await request(app)
      .post('/api/subscription/subscribe')
      .set('Authorization', `Bearer ${user.token}`)
      .send(mockSubscriptionData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'success' });

    const savedSubscription = await SubscriptionModel.findOne({
      endpoint: mockSubscriptionData.subscription.endpoint,
    });
    if (!savedSubscription) throw Error('no subscription');

    expect(savedSubscription).toBeTruthy();
    expect(savedSubscription.endpoint).toEqual(
      mockSubscriptionData.subscription.endpoint
    );
    expect(savedSubscription.keys).toEqual(
      mockSubscriptionData.subscription.keys
    );
    expect(savedSubscription.userId.toString()).toEqual(user.id);
  });

  it('should return 401 if no logged user', async () => {
    const res = await request(app)
      .post('/api/subscription/subscribe')
      .send(mockSubscriptionData);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 401 if invalid token is provided', async () => {
    const res = await request(app)
      .post('/api/subscription/subscribe')
      .set('Authorization', 'Bearer invalidtoken')
      .send(mockSubscriptionData);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 409 if subscription from same device already exists', async () => {
    await request(app)
      .post('/api/subscription/subscribe')
      .set('Authorization', `Bearer ${user.token}`)
      .send(mockSubscriptionData);

    const res = await request(app)
      .post('/api/subscription/subscribe')
      .set('Authorization', `Bearer ${user.token}`)
      .send(mockSubscriptionData);

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty(
      'message',
      'You already have subscription on this device'
    );
  });

  it('should subscribe for the same user with a different device (different endpoint)', async () => {
    const newDeviceMockSubscriptionData = {
      subscription: {
        endpoint: 'https://example.com/extra',
        keys: {
          p256dh: 'p256dhKey',
          auth: 'authKey',
        },
      },
      userId: user.id,
    };

    await request(app)
      .post('/api/subscription/subscribe')
      .set('Authorization', `Bearer ${user.token}`)
      .send(mockSubscriptionData);

    const res = await request(app)
      .post('/api/subscription/subscribe')
      .set('Authorization', `Bearer ${user.token}`)
      .send(newDeviceMockSubscriptionData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'success' });

    const savedSubscription1 = await SubscriptionModel.findOne({
      endpoint: mockSubscriptionData.subscription.endpoint,
    });
    const savedSubscription2 = await SubscriptionModel.findOne({
      endpoint: newDeviceMockSubscriptionData.subscription.endpoint,
    });

    if (!savedSubscription1) throw Error('no subscription for first endpoint');
    if (!savedSubscription2) throw Error('no subscription for second endpoint');

    expect(savedSubscription1).toBeTruthy();
    expect(savedSubscription1.endpoint).toEqual(
      mockSubscriptionData.subscription.endpoint
    );
    expect(savedSubscription1.keys).toEqual(
      mockSubscriptionData.subscription.keys
    );
    expect(savedSubscription1.userId.toString()).toEqual(user.id);

    expect(savedSubscription2).toBeTruthy();
    expect(savedSubscription2.endpoint).toEqual(
      newDeviceMockSubscriptionData.subscription.endpoint
    );
    expect(savedSubscription2.keys).toEqual(
      newDeviceMockSubscriptionData.subscription.keys
    );
    expect(savedSubscription2.userId.toString()).toEqual(user.id);
  });
});
