import express from 'express';
import { SubscriptionModel } from '../models/subscription';
import webpush from 'web-push';

const router = express.Router();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || '',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

router.get('/vapidPublicKey', (req, res) => {
  res.json(process.env.VAPID_PUBLIC_KEY);
});

router.post('/subscribe', async (req, res) => {
  console.log(3, req.body);
  const subscription = new SubscriptionModel({
    ...req.body.subscription,
    userId: req.body.userId,
  });
  try {
    await subscription.save();
    res.status(201).json({});
  } catch (error) {
    console.error('Failed to save subscription:', error);
    res.sendStatus(500);
  }
});

router.post('/sendNotification', async (req, res) => {
  const notificationPayload = JSON.stringify({
    title: req.body.title,
    body: req.body.body,
  });
  console.log(7777767, notificationPayload);
  try {
    const subscriptions = await SubscriptionModel.find({
      userId: req.body.userId,
    });
    console.log({ subscriptions });
    const promises = subscriptions.map((sub) => {
      console.log('=====');
      console.log(sub, notificationPayload);
      webpush.sendNotification(sub.toJSON(), notificationPayload);
    });
    await Promise.all(promises);
    res.status(200).json({ message: 'Notifications sent' });
  } catch (error) {
    console.error('Error sending notification, reason: ', error);
    res.sendStatus(500);
  }
});

export default router;
