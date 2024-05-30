import cron from 'node-cron';
import webpush from 'web-push';

import { SubscriptionModel } from '../models/subscription';
import { SettingsModel } from '../models/settings';
import { CronModel } from '../models/cron';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || '',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

const setNotification = async (userId: string) => {
  console.log('test');
  const notificationPayload = JSON.stringify({
    title: `It's time! Just one more word to learn!`,
    body: 'one small step...',
  });

  try {
    const subscriptions = await SubscriptionModel.find({
      userId,
    });

    const promises = subscriptions.map((sub) => {
      webpush.sendNotification(sub.toJSON(), notificationPayload);
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error sending notification, reason: ', error);
  }
};

export const scheduleNotification = async (userId: string) => {
  await removeNotification(userId);

  const userSettings = await SettingsModel.findOne({ userId }).lean();

  if (!userSettings) return;
  const times = userSettings.notifications.map(
    (notification) => notification.time
  );

  times.forEach(async (time) => {
    const [hh, mm] = time.split(':');
    const cronExpression = `${mm} ${hh} * * *`;
    const cronId = `${userId}-${time}`;

    cron.schedule(cronExpression, () => setNotification(userId), {
      name: cronId,
      scheduled: true,
      timezone: 'Europe/Warsaw',
    });

    const userCron = new CronModel({
      cronId,
      userId,
    });

    try {
      await userCron.save();
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  });
};

export const removeNotification = async (userId: string) => {
  await CronModel.find({ userId });

  Array.from(cron.getTasks()).filter(([name, task]) => {
    if (!name.includes(userId)) return;
    task.stop();
  });

  await CronModel.deleteMany({ userId });
};
