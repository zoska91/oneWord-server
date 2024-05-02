import express from 'express';

import { saveLog } from '../logger';
import { getUser } from '../utils/getUser';

const router = express.Router();

router.post('/message', async (req, res) => {
  const user = await getUser(req.headers.authorization);

  if (user === 401 || !user) {
    saveLog('error', 'GET', 'auth/user', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }
});

export default router;
