import request from 'supertest';
import bcrypt from 'bcrypt';

import { ILoggedUser, UserModel } from '../models/user';
import { SettingsModel } from '../models/settings';

export async function loginUserWithAi(app: any): Promise<ILoggedUser> {
  const hashedPassword = await bcrypt.hash('testpassword', 10);
  await new UserModel({
    username: 'testuser_ai',
    password: hashedPassword,
    isAi: true,
  }).save();

  const loginRes = await request(app).post('/api/auth/login').send({
    username: 'testuser_ai',
    password: 'testpassword',
  });

  return loginRes.body;
}

export async function loginUserNoAi(app: any): Promise<ILoggedUser> {
  // Rejestracja użytkownika
  const hashedPassword = await bcrypt.hash('testpassword', 10);
  await new UserModel({
    username: 'testuser_regular',
    password: hashedPassword,
  }).save();

  const loginRes = await request(app).post('/api/auth/login').send({
    username: 'testuser_regular',
    password: 'testpassword',
  });

  return loginRes.body;
}

export async function getUserWithSettings(app: any): Promise<ILoggedUser> {
  const username = 'testuser_regular';
  const password = 'testpassword';

  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({ username, password });

  if (registerRes.statusCode !== 200) {
    throw new Error('Registration failed');
  }

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username, password });

  if (loginRes.statusCode !== 200) {
    throw new Error('Login failed');
  }

  return loginRes.body;
}
