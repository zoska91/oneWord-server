import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../testsApp';
import { ModelName, cleanAll } from '../../helpers/cleaner';
import { loginAndAddResults } from '../../helpers/words';
import { resultsToAdd } from '../../helpers/data';
import { ILoggedUser } from '../../../models/user';

describe('GET /api/get-results Endpoint Tests', () => {
  let user: ILoggedUser;
  beforeAll(async () => {
    await cleanAll([ModelName.UserModel, ModelName.ResultModel]);
    user = await loginAndAddResults(app);
  });

  it('should return all results for regular user and count them correctly', async () => {
    const res = await request(app)
      .get(`/api/words/get-results`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);

    const regularUserResults = resultsToAdd.length;
    expect(res.body.results.length).toBe(regularUserResults);
  });

  it('should return only results from the last month for regular user', async () => {
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    lastMonthStart.setHours(0, 0, 0, 0);
    const formattedDate = lastMonthStart.toISOString().split('T')[0];

    const res = await request(app)
      .get('/api/words/get-results')
      .set('Authorization', `Bearer ${user.token}`)
      .query({ date: formattedDate });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);

    const lastMonthResults = resultsToAdd.filter((result) => {
      const createdDate = new Date(result.createdDate);
      return createdDate >= lastMonthStart;
    });

    expect(res.body.results.length).toBe(lastMonthResults.length);
  });

  it('should return 401 if user is not authenticated', async () => {
    const specificDate = new Date();
    specificDate.setHours(0, 0, 0, 0);

    const res = await request(app).get(`/api/words/get-results`);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return only results newer than or equal to 14 days ago for regular user', async () => {
    const now = new Date();
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const formattedDate = fourteenDaysAgo.toISOString();

    const res = await request(app)
      .get('/api/words/get-results')
      .set('Authorization', `Bearer ${user.token}`)
      .query({ date: formattedDate });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);

    const fourteenDaysAgoDate = new Date(fourteenDaysAgo);
    const newerResults = resultsToAdd.filter((result) => {
      const createdDate = new Date(result.createdDate);
      return createdDate >= fourteenDaysAgoDate;
    });

    expect(res.body.results.length).toBe(newerResults.length);
  });
});
