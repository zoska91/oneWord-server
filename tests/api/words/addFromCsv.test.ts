import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import path from 'path';

import app from '../../testsApp';
import { WordModel } from '../../../models/word';
import { loginRegularUser } from '../../helpers/auth';
import { ILoggedUser } from '../../../models/user';
import { ModelName, cleanAll } from '../../helpers/cleaner';

describe('POST /api/words/add-csv Endpoint Tests', async () => {
  let user: ILoggedUser;
  const filePath = `../files`;

  beforeAll(async () => {
    await cleanAll([
      ModelName.UserModel,
      ModelName.UserModel,
      ModelName.SubscriptionModel,
    ]);

    user = await loginRegularUser(app);
  });

  it('should add words from CSV for authenticated user with valid data', async () => {
    const csvFilePath = path.join(__dirname, filePath, 'valid_words.csv');

    const res = await request(app)
      .post('/api/words/add-csv')
      .set('Authorization', `Bearer ${user.token}`)
      .attach('file', csvFilePath);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Success' });

    const savedWords = await WordModel.find({ userId: user.id });
    expect(savedWords).toHaveLength(3);
  });

  it('should return 401 if no logged user', async () => {
    const csvFilePath = path.join(__dirname, filePath, 'valid_words.csv');
    const res = await request(app)
      .post('/api/words/add-csv')
      .attach('file', csvFilePath);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return 400 if no file is provided', async () => {
    const res = await request(app)
      .post('/api/words/add-csv')
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('File was not found');
  });

  it('should return 400 if more than one file is provided', async () => {
    const csvFilePath = path.join(__dirname, filePath, 'valid_words.csv');
    const res = await request(app)
      .post('/api/words/add-csv')
      .set('Authorization', `Bearer ${user.token}`)
      .attach('file', csvFilePath)
      .attach('file', csvFilePath);

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Only one file is allowed');
  });

  it('should return 400 if file is empty', async () => {
    const emptyCsvFilePath = path.join(__dirname, filePath, 'empty.csv');
    const res = await request(app)
      .post('/api/words/add-csv')
      .set('Authorization', `Bearer ${user.token}`)
      .attach('file', emptyCsvFilePath);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'empty file');
  });

  it('should return 200 if file has more than 50 rows', async () => {
    const largeCsvFilePath = path.join(__dirname, filePath, 'large_file.csv');
    const res = await request(app)
      .post('/api/words/add-csv')
      .set('Authorization', `Bearer ${user.token}`)
      .attach('file', largeCsvFilePath);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'to much rows');
  });

  it('should return 400 if CSV contains invalid basicWord key', async () => {
    const invalidBasicWordCsvFilePath = path.join(
      __dirname,
      filePath,
      'invalid_basicWord.csv'
    );
    const res = await request(app)
      .post('/api/words/add-csv')
      .set('Authorization', `Bearer ${user.token}`)
      .attach('file', invalidBasicWordCsvFilePath);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'wrong basic word key');
  });

  it('should return 400 if CSV contains invalid transWord key', async () => {
    const invalidTransWordCsvFilePath = path.join(
      __dirname,
      filePath,
      'invalid_transWord.csv'
    );
    const res = await request(app)
      .post('/api/words/add-csv')
      .set('Authorization', `Bearer ${user.token}`)
      .attach('file', invalidTransWordCsvFilePath);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'wrong transform word key');
  });

  it('should return 500 if wrong file', async () => {
    const invalidFilePath = path.join(__dirname, filePath, 'invalid_file.txt');
    const res = await request(app)
      .post('/api/words/add-csv')
      .set('Authorization', `Bearer ${user.token}`)
      .attach('file', invalidFilePath);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Only CSV files are allowed');
  });
});
