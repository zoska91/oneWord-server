import cron from 'node-cron';
import { SubscriptionModel } from '../models/subscription';
import webpush from 'web-push';
import { INotification, ISettings, SettingsModel } from '../models/settings';
import { CronModel } from '../models/cron';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || '',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

const setNotification = async (userId: string) => {
  console.log(6, { userId });
  const notificationPayload = JSON.stringify({
    title: `It's time! Just one more word to learn!`,
    body: 'one small step...',
  });

  try {
    const subscriptions = await SubscriptionModel.find({
      userId,
    });

    console.log(7, { subscriptions });

    const promises = subscriptions.map((sub) => {
      webpush.sendNotification(sub.toJSON(), notificationPayload);
    });
    console.log(8, { promises });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error sending notification, reason: ', error);
  }
};

export const scheduleNotification = async (userId: string) => {
  console.log(1, { userId });
  const userSettings = await SettingsModel.findOne({ userId }).lean();
  console.log(2, { userSettings });
  if (!userSettings) return;
  const times = userSettings.notifications.map(
    (notification) => notification.time
  );
  console.log(3, { times });

  times.forEach(async (time) => {
    const [hh, mm] = time.split(':');
    const cronExpression = `${mm} ${hh} * * *`;
    const cronId = `${userId}-${time}`;

    console.log(4, { hh, mm, cronExpression, cronId });

    cron.schedule(cronExpression, () => setNotification(userId), {
      name: cronId,
      scheduled: true,
      timezone: 'Europe/Warsaw',
    });

    const userCron = new CronModel({
      cronId,
      userId,
    });

    console.log(5, userCron);
    try {
      await userCron.save();
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }

    console.log(99999, cron.getTasks());
  });
};

export const removeNotification = async (userId: string) => {
  const userCrons = await CronModel.find({ userId });
  const userCronsIds = userCrons.map((userCron) => userCron.cronId);

  Array.from(cron.getTasks()).filter(([name, task]) => {
    if (!userCronsIds.includes(name)) return;
    task.stop();
  });

  await CronModel.deleteMany({ userId });
};
