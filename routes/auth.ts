import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserModel } from '../models/user';
import config from '../config';
import { SettingsModel } from '../models/settings';
import { saveLog } from '../logger';
import { getUser } from '../utils/getUser';

const router = express.Router();

router.get('/user', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

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
