import jwt from 'jsonwebtoken';

import { saveLog } from '../logger';
import { UserModel } from '../models/user';
import config from '../config';

export const getUser = async (authorization?: string) => {
  try {
    if (!authorization) {
      return 401;
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      saveLog('warn', 'GET', 'getUser', 'no token', authorization);
      return 401;
    }

    if (!config.secret) {
      saveLog('info', 'GET', 'get user', 'user logged', { authorization });
      console.log('No database secret provided');

      return 401;
    }

    const { id } = jwt.verify(token, config.secret) as {
      username: string;
      id: string;
    };
    const user = await UserModel.findOne({ id }).lean();

    return user;
  } catch (e) {
    saveLog('error', 'GET', 'getUser', '', e);
    return 401;
  }
};
