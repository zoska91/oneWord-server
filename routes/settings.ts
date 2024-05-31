import express from 'express';

import { getUser } from '../utils/getUser';
import { saveLog } from '../logger';
import { SettingsModel } from '../models/settings';
import { scheduleNotification } from '../utils/subscription';

const router = express.Router();

router.get('/user-settings', async (req, res) => {
  try {
    const user = await getUser(req?.headers?.authorization);

    if (user === 401 || !user) {
      saveLog('error', 'GET', 'auth/user', 'no logged user', { user });
      res.status(404).json({ message: 'no logged user' });
      return;
    }

    const settings = await SettingsModel.findOne({ userId: user._id });

    res.json(settings);
  } catch (e) {
    console.log(e);
    saveLog('error', 'GET', 'settings/user-settings', 'system error', {
      error: e,
    });
    res.status(500).json({ message: 'something went wrong' });
  }
});

router.put('/user-settings', async (req, res) => {
  try {
    const user = await getUser(req?.headers?.authorization);
    if (user === 401 || !user) {
      saveLog('error', 'GET', 'auth/user', 'no logged user', { user });
      res.status(404).json({ message: 'no logged user' });
      return;
    }

    const userId = user?._id.toString();

    await SettingsModel.findOneAndUpdate({ userId }, req.body);
    scheduleNotification(userId);

    saveLog(
      'info',
      'PUT',
      'settings/user-settingss',
      'update settings success',
      { userId }
    );
    res.json({ message: 'Update success' });
  } catch (e) {
    console.log(e);
    saveLog('error', 'PUT', 'settings/user-settings', 'system error', {
      error: e,
    });
    res.status(500).json({ message: 'something went wrong' });
  }
});

export default router;
