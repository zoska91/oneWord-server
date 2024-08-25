import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { ResultModel } from '../../../models/result';
import { loginRegularUser } from '../../helpers/auth';
import { ILoggedUser } from '../../../models/user';
import { ModelName, cleanAll } from '../../helpers/cleaner';

describe('POST /api/words/add-results Endpoint Tests', async () => {
  let user: ILoggedUser;
  const mockResultData = { correctAnswers: 3, badAnswers: 1 };

  beforeAll(async () => {
    await cleanAll([
      ModelName.UserModel,
      ModelName.ResultModel,
      ModelName.SubscriptionModel,
    ]);

    user = await loginRegularUser(app);
  });

  it('should add new results for authenticated user with valid data', async () => {
    const res = await request(app)
      .post('/api/words/add-results')
      .set('Authorization', `Bearer ${user.token}`)
      .send(mockResultData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Success' });

    const savedResult = await ResultModel.findOne({ userId: user.id });
    if (!savedResult) throw Error('no result found');

    expect(savedResult).toBeTruthy();
    expect(savedResult.correctAnswers).toEqual(mockResultData.correctAnswers);
    expect(savedResult.badAnswers).toEqual(mockResultData.badAnswers);

    expect(savedResult.userId.toString()).toEqual(user.id);

    const currentDate = new Date();
    const savedDate = new Date(savedResult.createdDate);
    expect(savedDate.getFullYear()).toEqual(currentDate.getFullYear());
    expect(savedDate.getMonth()).toEqual(currentDate.getMonth());
    expect(savedDate.getDate()).toEqual(currentDate.getDate());
  });

  it('should return 401 if no logged user', async () => {
    const res = await request(app)
      .post('/api/words/add-results')
      .send(mockResultData);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 400 if correctAnswers is missing', async () => {
    const res = await request(app)
      .post('/api/words/add-results')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        badAnswers: 1,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'body.correctAnswers is a required field'
    );
  });

  it('should return 400 if badAnswers is missing', async () => {
    const res = await request(app)
      .post('/api/words/add-results')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        correctAnswers: 3,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'body.badAnswers is a required field'
    );
  });
});
