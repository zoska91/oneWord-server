import request from 'supertest';
import bcrypt from 'bcrypt';

import { ILoggedUser, UserModel } from '../models/user';

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
