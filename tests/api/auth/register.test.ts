import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { UserModel } from '../../../models/user';

import app from '../../testsApp';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpassword',
    });

    const savedUser = await UserModel.findOne({ username: 'testuser' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'success');

    expect(savedUser).toBeDefined();
    expect(savedUser?.username).toBe('testuser');
  });

  it('should not register an existing user', async () => {
    // Ensure the user exists
    await new UserModel({
      username: 'testuser',
      password: 'hashedpassword',
    }).save();

    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpassword',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      'this user is already in the database'
    );
  });

  it('should return an error if username is too long', async () => {
    const longUsername = 'a'.repeat(33);

    const res = await request(app).post('/api/auth/register').send({
      username: longUsername,
      password: 'testpassword',
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.username must be at most 32 characters'
    );
  });

  it('should return an error if password is too long', async () => {
    const longPassword = 'a'.repeat(65); // Password longer than max length 64

    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: longPassword,
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.password must be at most 64 characters'
    );
  });

  it('should return an error if username is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      password: 'testpassword',
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.username is a required field'
    );
  });

  it('should return an error if password is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty(
      'message',
      'body.password is a required field'
    );
  });
});
