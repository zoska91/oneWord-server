import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';
import admin from 'firebase-admin';

import { UserModel } from '../models/user';
import config from '../config';
import { SettingsModel } from '../models/settings';
import { saveLog } from '../logger';
import { getUser } from '../utils/getUser';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

const token =
  '1//09grKLeQEPdSQCgYIARAAGAkSNwF-L9Irp78jxad-M53KvI1fI-4Upw4cSqRfgaSFK5TN6NIs1qKCASQR53Zh8iZcAmNRiIDEaO4';
const router = express.Router();

initializeApp({
  credential: applicationDefault(),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
});

const createGroup = async () => {
  try {
    const response = await fetch(
      'https://fcm.googleapis.com/fcm/notification',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'key=AAAADw53Mig:APA91bGoDRglBacw6AdhP0vy5JkZbpsgYjyFtuFpniVFmBr5q1ZIZA-lcdVLK9J-EbubFhZ19EgXTCqsvDPR9WLd8cBl4LHQK6SgUH0dBAqR962tILN1DnGP5f5PtH2dhoMtEBt_Rgt6',
          project_id: '64667202088',
        },
        body: JSON.stringify({
          operation: 'create',
          notification_key_name: `userId-6628d4a57e3ed82fe4327057`,
          registration_ids: [
            'el0OtKr5UGk4o2hZ0bW9Bt:APA91bE85wK22fmiR8RF63FDzTqGwjE4j_a7aXYBYBtY---lglLq3LZ6syEDC9NLRlwkqZGStOhP2x98NOhTqS2oKLKjVvbX857Hj57IlZeHEZYuDpZSKXKN6nW6RFAHLqXKForHZAIv',
          ],
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    return data.notification_key;
  } catch (e) {
    console.log(e);
  }
};

const getNotificationKey = async () => {
  try {
    const response = await fetch(
      'https://fcm.googleapis.com/fcm/notification?notification_key_name=userId-6628d4a57e3ed82fe4327057',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'key=AAAADw53Mig:APA91bGoDRglBacw6AdhP0vy5JkZbpsgYjyFtuFpniVFmBr5q1ZIZA-lcdVLK9J-EbubFhZ19EgXTCqsvDPR9WLd8cBl4LHQK6SgUH0dBAqR962tILN1DnGP5f5PtH2dhoMtEBt_Rgt6',
          project_id: '64667202088',
        },
      }
    );

    const data = await response.json();
    console.log(data);
    return data.notification_key;
  } catch (e) {
    console.log(e);
  }
};
const sendGroupNotification = async (): Promise<void> => {
  const messaging = admin.messaging();
  const message = {
    token:
      'APA91bHV-OEsYOViB-7LqBs3GtrCy7D2rgKQnqG5lCJES4nqSbBqrUH4WfZhjucMIw6EMl71XRuUVZFkClWRU8b5-L1_9UvoB8QLTa8a-vhQcyL3lQ_xG3P_OfoP44mQRgWouy71Bv_8',
    data: {
      hello: 'This is a Firebase Cloud Messaging message from the Admin SDK!',
    },
  };

  // Przygotowanie wiadomości do wysłania
  messaging
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
};
// const sendGroupNotification = async (): Promise<void> => {
//   // const token = getAccessToken();
//   // console.log({ token })
//   try {
//     const response = await fetch(
//       `https://fcm.googleapis.com/v1/projects/oneword-87b29/messages:send`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `key=AAAADw53Mig:APA91bFuWc3WpmiyAjS_hy5Hf8SQeYRqjmSmNgXIpFQbGeOroc9TmATgslQhb2PP3TP4Y5E6NTH3B6IJdi6Rsu6AK5MqD9q5YwfMLRvDz-mEuD9xKJqIj81d0ggegbsttCUWpe6qQuZq`,
//         },
//         body: JSON.stringify({
//           message: {
//             token:
//               'APA91bHV-OEsYOViB-7LqBs3GtrCy7D2rgKQnqG5lCJES4nqSbBqrUH4WfZhjucMIw6EMl71XRuUVZFkClWRU8b5-L1_9UvoB8QLTa8a-vhQcyL3lQ_xG3P_OfoP44mQRgWouy71Bv_8',
//             data: {
//               hello: 'This is a Firebase Cloud Messaging device group message!',
//             },
//           },
//         }),
//       }
//     );

//     const data = await response.json();
//     console.log('Notification sent successfully:', data);
//     console.log('Notification sent successfully:', data.error.details);
//   } catch (error) {
//     console.error('Error sending notification:', error);
//   }
// };

router.get('/user', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);
  // createGroup();
  // getNotificationKey();

  sendGroupNotification();
  // cron.schedule('10 20 * * *', () => {
  //   console.log('Sending daily notification');
  //   sendGroupNotification();
  // });

  if (user === 401 || !user) {
    saveLog('error', 'GET', 'auth/user', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }

  const { username, isAi, _id } = user;
  saveLog('info', 'GET', 'auth/user', 'user logged', { user });
  res.json({ username, id: _id, isAi });
});

router.post('/login', async (req, res) => {
  const username = req.body.username?.toLowerCase();
  const password = req.body.password;

  try {
    const data = await UserModel.findOne({ username }).lean();
    if (!data) {
      saveLog('warn', 'POST', 'auth/login', 'no username', { username });
      return res
        .status(404)
        .send({ message: 'Incorrect username or password.' });
    }

    bcrypt.compare(password, data.password, async (err, result) => {
      if (result) {
        var token = jwt.sign(
          { id: data._id, username: data.username },
          'abfewvsdvarebr'
        );

        saveLog('info', 'POST', 'auth/login', 'login success', {
          userId: data._id,
        });

        res.status(200).send({
          message: 'Login Successful',
          token,
          isAi: data.isAi,
          id: data._id,
        });
      } else {
        saveLog('warn', 'POST', 'auth/login', 'wrong password', {
          userId: data._id,
        });

        return res.status(400).send({
          message: 'Incorrect username or password.',
        });
      }
    });
  } catch (err) {
    if (err) {
      saveLog('error', 'POST', 'auth/login', 'system error', { error: err });

      res.status(500).send({
        message: 'Something went wrong',
      });
    }
  }
});

router.post('/register', async (req, res) => {
  try {
    const username = req.body.username?.toLowerCase();
    const password = req.body.password;
    const findUser = await UserModel.findOne({ username });

    if (findUser) {
      saveLog('info', 'POST', 'auth/register', 'user exists', { username });
      return res
        .status(400)
        .json({ message: 'this user is already in the database' });
    }

    const hash = await bcrypt.hash(password, config.saltRounds);
    if (!hash) {
      saveLog('info', 'POST', 'auth/register', 'hash issue', null);
      return res.status(400).json('Something is wrong with your password');
    }

    const newUser = new UserModel({
      username,
      password: hash,
    });

    const errors = newUser.validateSync();

    if (errors) {
      saveLog('info', 'POST', 'auth/register', 'invalid data', errors);
      return res.status(400).json(errors);
    }

    const userData = await newUser.save();

    if (!userData) {
      saveLog('info', 'POST', 'auth/register', 'save issue', null);
      return res.status(400).json('Something wrong with saving user');
    }

    const defaultSettings = new SettingsModel({
      userId: userData._id,
    });
    defaultSettings.save();

    saveLog('info', 'POST', 'auth/register', 'register success', {
      userId: userData._id,
    });

    res.json({ message: 'success' });
  } catch (e) {
    saveLog('error', 'POST', 'auth/register', 'system error', { error: e });
    res.status(500).json(e);
  }
});

export default router;
