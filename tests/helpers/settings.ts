import request from 'supertest';
import { ILoggedUser } from '../../models/user';

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
