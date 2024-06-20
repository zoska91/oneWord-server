import request from 'supertest';
import { ILoggedUser } from '../../models/user';
import { loginExtraUser, loginRegularUser } from './auth';

export const mockSubscriptionData = (userId: string) => ({
  subscription: {
    endpoint: 'https://example.com',
    keys: {
      p256dh: 'p256dhKey',
      auth: 'authKey',
    },
  },
  userId,
});
export const mockExtraSubscriptionData = (userId: string) => ({
  subscription: {
    endpoint: 'https://example.com/extra',
    keys: {
      p256dh: 'p256dhKey',
      auth: 'authKey',
    },
  },
  userId,
});

export async function getUserWithSubscription(app: any): Promise<ILoggedUser> {
  const user = await loginRegularUser(app);

  await request(app)
    .post('/api/subscription/subscribe')
    .set('Authorization', `Bearer ${user.token}`)
    .send(mockSubscriptionData(user.id));

  return user;
}

export async function geExtraUserWithSubscription(
  app: any
): Promise<ILoggedUser> {
  const user = await loginExtraUser(app);

  await request(app)
    .post('/api/subscription/subscribe')
    .set('Authorization', `Bearer ${user.token}`)
    .send(mockExtraSubscriptionData(user.id));

  return user;
}
