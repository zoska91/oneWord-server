import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { SubscriptionModel } from '../../../models/subscription';
import { loginRegularUser } from '../../helpers/auth';
import { ModelName, cleanAll } from '../../helpers/cleaner';
import { ILoggedUser } from '../../../models/user';
import { beforeEach } from 'node:test';
import {
  geExtraUserWithSubscription,
  getUserWithSubscription,
  mockExtraSubscriptionData,
  mockSubscriptionData,
} from '../../helpers/subscription';

describe.only('DELETE /api/subscription/unsubscribe-device Endpoint Tests', async () => {
  beforeEach(async () => {
    await cleanAll([ModelName.UserModel, ModelName.SubscriptionModel]);
  });

  it.only('should unsubscribe authenticated user successfully', async () => {
    const user = await getUserWithSubscription(app);

    const res = await request(app)
      .delete('/api/subscription/unsubscribe-device')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ subscription: mockSubscriptionData(user.id).subscription });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('User unsubscribed successfully');

    const subscription = await SubscriptionModel.findOne({
      endpoint: mockSubscriptionData(user.id).subscription.endpoint,
    });

    expect(subscription).toBeNull();
  });

  it('should return 401 if no logged user', async () => {
    const user = await getUserWithSubscription(app);

    const res = await request(app)
      .delete('/api/subscription/unsubscribe-device')
      .send({ subscription: mockSubscriptionData(user.id).subscription });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 401 if invalid token is provided', async () => {
    const user = await getUserWithSubscription(app);

    const res = await request(app)
      .delete('/api/subscription/unsubscribe-device')
      .set('Authorization', 'Bearer invalidtoken')
      .send({ subscription: mockSubscriptionData(user.id).subscription });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should unsubscribe authenticated user and remove only the specified subscription', async () => {
    const user = await getUserWithSubscription(app);
    const extraUser = await geExtraUserWithSubscription(app);

    const res = await request(app)
      .delete('/api/subscription/unsubscribe-device')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ subscription: mockSubscriptionData(user.id).subscription });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('User unsubscribed successfully');

    const removedSubscription = await SubscriptionModel.findOne({
      endpoint: mockSubscriptionData(user.id).subscription.endpoint,
    });

    const remainingSubscription = await SubscriptionModel.findOne({
      endpoint: mockExtraSubscriptionData(extraUser.id).subscription.endpoint,
    });

    expect(removedSubscription).toBeNull();
    expect(remainingSubscription).toBeTruthy();
    expect(remainingSubscription?.endpoint).toEqual(
      mockExtraSubscriptionData(extraUser.id).subscription.endpoint
    );
    expect(remainingSubscription?.keys).toEqual(
      mockExtraSubscriptionData(extraUser.id).subscription.keys
    );
    expect(remainingSubscription?.userId.toString()).toEqual(extraUser.id);
  });
});
