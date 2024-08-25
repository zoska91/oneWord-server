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

export const setNotification = async (userId: string) => {
  const notificationPayload = JSON.stringify({
    title: `It's time! Just one more word to learn!`,
    body: 'one small step...',
    data: {
      url: 'https://oneword.byst.re', // URL Twojej aplikacji PWA
    },
  });

  try {
    const subscriptions = await SubscriptionModel.find({ userId });

    if (!subscriptions || subscriptions.length === 0) return;

    const promises = subscriptions.map((sub) =>
      webpush
        .sendNotification(sub.toJSON(), notificationPayload)
        .then((response) =>
          console.log('Notification sent successfully:', response)
        )
        .catch((error) => {
          console.error('Error sending notification:', error);
          return null; // Return null to filter out failed promises
        })
    );

    await Promise.all(promises.filter((promise) => promise !== null));
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

  try {
    for (const time of times) {
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
        time,
      });

      await userCron.save();
    }
  } catch (error) {
    console.error('Failed to save subscription:', error);
  }
};

export const removeNotification = async (userId: string) => {
  Array.from(cron.getTasks()).filter(async ([name, task]) => {
    if (!name.includes(userId)) return;
    task.stop();
  });

  await CronModel.deleteMany({ userId });
};

export const runCron = async () => {
  const notifications = await CronModel.find().lean();

  if (notifications?.length < 0) return;

  notifications.forEach(async (notification) => {
    if (!notification?.time) return;

    const [hh, mm] = notification.time.split(':');
    const cronExpression = `${mm} ${hh} * * *`;
    cron.schedule(cronExpression, () => setNotification(notification.userId), {
      name: notification.cronId,
      scheduled: true,
      timezone: 'Europe/Warsaw',
    });
  });

  console.log('cron running !!');
};
