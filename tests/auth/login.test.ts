import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserModel } from '../../models/user';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../testsApp';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

describe('POST /api/auth/login', () => {
  it('should log in an existing user with correct credentials', async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await new UserModel({
      username: 'testuser',
      password: hashedPassword,
    }).save();

    // Perform login request
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'testpassword',
    });

    // Assertions
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Login Successful');
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('isAi', false);
  });

  it('should return 404 if username does not exist', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'nonexistentuser',
      password: 'testpassword',
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty(
      'message',
      'Incorrect username or password.'
    );
  });

  it('should return 400 if password is incorrect', async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await new UserModel({
      username: 'testuser',
      password: hashedPassword,
    }).save();

    // Perform login request with incorrect password
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'incorrectpassword',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'Incorrect username or password.'
    );
  });

  it('should return 500 if username validation fails', async () => {
    const longUsername = 'a'.repeat(33);

    const res = await request(app).post('/api/auth/login').send({
      username: longUsername,
      password: 'testpassword',
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.username must be at most 32 characters'
    );
  });

  it('should return 500 if password validation fails', async () => {
    const longPassword = 'a'.repeat(65);

    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: longPassword,
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.password must be at most 64 characters'
    );
  });

  it('should return 500 if username is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      password: 'testpassword',
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.username is a required field'
    );
  });

  it('should return 500 if password is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.password is a required field'
    );
  });
});
