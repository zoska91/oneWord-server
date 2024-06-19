import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { getUser } from '../../../utils/getUser';
import { ILoggedUser, UserModel } from '../../../models/user';
import { loginAndAddWords } from '../../helpers/words';
import app from '../../testsApp';
import config from '../../../config';

describe('getUser Function Tests', () => {
  let user: ILoggedUser;

  beforeAll(async () => {
    user = await loginAndAddWords(app);
  });

  it('should return 401 if authorization is not provided', async () => {
    const result = await getUser();
    expect(result).toBe(401);
  });

  it('should return 401 if token is not provided', async () => {
    const result = await getUser('Bearer ');
    expect(result).toBe(401);
  });

  it('should return 401 if secret is not provided', async () => {
    vi.mocked(config).secret = '';

    const result = await getUser(`Bearer ${user.token}`);
    expect(result).toBe(401);
    vi.mocked(config).secret = 'abfewvsdvarebr';
  });

  it('should return 401 if token verification fails', async () => {
    const result = await getUser('Bearer invalid.token.here');
    expect(result).toBe(401);
  });

  it('should return the user if token verification succeeds', async () => {
    const result = await getUser(`Bearer ${user.token}`);

    console.log(result);
    expect(result).toEqual(
      expect.objectContaining({
        username: 'testuser_regular',
      })
    );
  });
});
