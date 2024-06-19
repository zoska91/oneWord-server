import express from 'express';
import webpush from 'web-push';
import cron from 'node-cron';

import {
  removeNotification,
  scheduleNotification,
} from '../utils/subscription';
import { SubscriptionModel } from '../models/subscription';
import { getUser } from '../utils/getUser';
import { saveLog } from '../logger';
import { subscribeSchema } from '../validation/subscription';
import { validate } from '../validation';

const router = express.Router();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || '',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

router.get('/vapidPublicKey', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  if (user === 401 || !user) {
    saveLog('error', 'GET', 'subscription/vapidPublicKey', 'no logged user', {
      user,
    });
    res.status(401).json({ message: 'no logged user' });
    return;
  }

  res.json(process.env.VAPID_PUBLIC_KEY);
});

router.post('/subscribe', validate(subscribeSchema), async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  try {
    if (user === 401 || !user) {
      saveLog('error', 'GET', 'subscription/subscribe', 'no logged user', {
        user,
      });
      res.status(401).json({ message: 'no logged user' });
      return;
    }

    const userId = user?._id;

    const hasSubscription = await SubscriptionModel.findOne({
      endpoint: req.body.subscription,
    });

    if (hasSubscription) {
      res
        .status(409)
        .json({ message: 'You already have subscription on this device' });
      return;
    }

    const subscription = new SubscriptionModel({
      ...req.body.subscription,
      userId,
    });

    await subscription.save();
    await scheduleNotification(req.body.userId);
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Failed to save subscription:', error);
    res.sendStatus(500);
  }
});

router.delete('/unsubscribe', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  if (user === 401 || !user) {
    saveLog('error', 'GET', 'subscription/unsubscribe', 'no logged user', {
      user,
    });
    res.status(401).json({ message: 'no logged user' });
    return;
  }

  const userId = user?._id.toString();

  try {
    await SubscriptionModel.deleteMany({ userId });
    await removeNotification(userId);
    res.status(200).send('User unsubscribed successfully');
  } catch (error) {
    console.error('Failed to unsubscribe user:', error);
    res.sendStatus(500);
  }
});

router.get('/showCrons', async (req, res) => {
  const crons = cron.getTasks();
  res.json({ crons: crons.size });
});

// router.post('/sendNotification', async (req, res) => {
//   const notificationPayload = JSON.stringify({
//     title: req.body.title,
//     body: req.body.body,
//   });

//   try {
//     const subscriptions = await SubscriptionModel.find({
//       userId: req.body.userId,
//     });

//     const promises = subscriptions.map((sub) => {
//       console.log(2, { sub });
//       webpush.sendNotification(sub.toJSON(), notificationPayload);
//     });
//     console.log(1, { promises });

//     await Promise.all(promises);
//     res.status(200).json({ message: 'Notifications sent' });
//   } catch (error) {
//     console.error('Error sending notification, reason: ', error);
//     res.sendStatus(500);
//   }
// });

export default router;
