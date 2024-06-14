import express from 'express';
import mongoose from 'mongoose';
import csvtojson from 'csvtojson';

import { SettingsModel } from '../models/settings';
import { IWord, WordModel } from '../models/word';
import {
  checkIsBreakDay,
  getRandomWord,
  getShuffleWords,
  isTheSameDates,
} from '../utils/words';
import { saveLog } from '../logger';
import { getUser } from '../utils/getUser';
import { validate } from '../validation';
import {
  addWordSchema,
  deleteWordSchema,
  getLearnedWordsSchema,
  putWordSchema,
} from '../validation/words';

type FiltersType = {
  userId: string;
  status: number;
  createdDate?: { $gte: Date };
};

const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const user = await getUser(req?.headers?.authorization);
    console.log(2, user);
    if (user === 401 || !user) {
      saveLog('error', 'GET', 'words/all', 'no logged user', { user });
      res.status(401).json({ message: 'no logged user' });
      return;
    }
    const userId = user?._id;
    console.log(1, userId);
    const words = await WordModel.find({ userId });

    saveLog('info', 'GET', 'words/all', 'get word success', { userId });
    res.json({ words });
  } catch (e) {
    console.log(e);
    saveLog('error', 'GET', 'words/all', 'system error', { error: e });
    res.status(500).json({ message: 'something went wrong' });
  }
});

router.post('/add-one', validate(addWordSchema), async (req, res) => {
  try {
    const user = await getUser(req?.headers?.authorization);

    if (user === 401 || !user) {
      saveLog('error', 'POST', 'words/add-one', 'no logged user', { user });
      res.status(401).json({ message: 'no logged user' });
      return;
    }
    const userId = user?._id;

    const newWord = new WordModel({ userId, ...req.body });
    newWord.save();
    saveLog('info', 'POST', 'words/add-one', 'add success', {
      userId,
      wordId: newWord._id,
    });
    res.json({ message: 'Success' });
  } catch (e) {
    console.log(e);
    saveLog('info', 'POST', 'words/add-one', 'system error', { error: e });
    res.status(500).json({ message: 'something went wrong' });
  }
});

router.post('/add-csv', async (req, res) => {
  try {
    const user = await getUser(req?.headers?.authorization);

    if (user === 401 || !user) {
      saveLog('error', 'POST', 'words/add-csv', 'no logged user', { user });
      res.status(404).json({ message: 'no logged user' });
      return;
    }
    const userId = user?._id;

    if (!req.files?.file) {
      saveLog('warn', 'POST', 'words/add-csv', 'no file', { files: req.files });
      res.status(400).send('File was not found');
      return;
    }

    const file = req.files?.file;
    if (Array.isArray(file)) {
      saveLog('warn', 'POST', 'words/add-csv', 'more that one file', {
        files: req.files,
      });
      res.status(400).send('Only one file is allowed');
      return;
    }

    await csvtojson({ noheader: false, output: 'json' })
      .fromString(file.data.toString('utf8'))
      .then((jsonObj) => {
        if (!jsonObj.length)
          return res.status(400).json({ message: 'empty file' });
        if (jsonObj.length > 50)
          return res.status(200).json({ message: 'to much rows' });

        jsonObj.forEach((word) => {
          if (!word.basicWord)
            return res.status(400).json({ message: 'wrong basic word key' });
          if (!word.transWord)
            return res
              .status(400)
              .json({ message: 'wrong transform word key' });

          const newWord = new WordModel({ userId, ...word });

          newWord.save();
        });

        res.json({ message: 'Success' });
      });
  } catch (e) {
    console.log(e);
    saveLog('error', 'POST', 'words/add-csv', 'system error', {
      error: e,
    });
    res.status(500).json({ message: 'something went wrong' });
  }
});

router.put('/update-one/:id', validate(putWordSchema), async (req, res) => {
  try {
    const user = await getUser(req?.headers?.authorization);

    if (user === 401 || !user) {
      saveLog('error', 'POST', 'words/add-csv', 'no logged user', { user });
      res.status(401).json({ message: 'no logged user' });
      return;
    }
    const userId = user?._id;

    const id = new mongoose.Types.ObjectId(req.params.id);
    const data = await WordModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { updatedDate: new Date(), ...req.body },
      { new: true }
    );

    if (!data) {
      saveLog('info', 'PUT', 'words/update-one', 'word not found', {
        wordId: id,
      });

      res.status(404).json({ message: 'word not found' });
      return;
    }
    saveLog('info', 'PUT', 'words/update-one', 'update success', {
      wordId: id,
    });

    res.json(data);
  } catch (e) {
    console.log(e);
    saveLog('error', 'PUT', 'words/update-one', 'system error', {
      error: e,
      wordId: req.params.id,
    });

    res.status(500).json({ message: 'something went wrong' });
  }
});

router.delete(
  '/delete-one/:id',
  validate(deleteWordSchema),
  async (req, res) => {
    try {
      const user = await getUser(req?.headers?.authorization);

      if (user === 401 || !user) {
        saveLog('error', 'POST', 'words/add-csv', 'no logged user', { user });
        res.status(401).json({ message: 'no logged user' });
        return;
      }
      const userId = user?._id;

      const id = new mongoose.Types.ObjectId(req.params.id);
      const data = await WordModel.findByIdAndDelete({
        _id: id,
        userId,
      });

      if (!data) {
        saveLog('info', 'PUT', 'words/update-one', 'word not found', {
          wordId: id,
        });

        res.status(404).json({ message: 'word not found' });
        return;
      }

      saveLog('error', 'DELETE', 'words/delete-one', 'update success', {
        wordId: id,
      });
      res.json(data);
    } catch (e) {
      console.log(e);
      saveLog('error', 'DELETE', 'words/delete-one', 'system error', {
        error: e,
        wordId: req.params.id,
      });

      res.status(500).json({ message: 'something went wrong' });
    }
  }
);

router.get('/today-word', async (req, res) => {
  try {
    const user = await getUser(req?.headers?.authorization);

    if (user === 401 || !user) {
      saveLog('error', 'GET', 'today-word', 'no logged user', { user });
      res.status(401).json({ message: 'no logged user' });
      return;
    }
    const userId = user?._id;

    const { languageToLearn, breakDay, isBreak } =
      (await SettingsModel.findOne({
        userId,
      }).lean()) || {};

    if (breakDay && isBreak && checkIsBreakDay(breakDay))
      return res.json({ message: 'Today is break day!' });

    const currentWord: IWord | null = await WordModel.findOne({
      status: 1,
      userId,
    }).lean();

    const allUserWords = await WordModel.find({
      userId,
      // addLang: languageToLearn, // TODO!!!
    });

    const words = allUserWords.filter(
      (word) => word.addLang === Number(languageToLearn)
    );

    let todayWord =
      currentWord && isTheSameDates(currentWord.updatedDate)
        ? currentWord
        : await getRandomWord(words, currentWord);

    if (!todayWord) {
      res.status(404).json({ message: 'no words' });
      return;
    }

    const shuffleWords = getShuffleWords(words, todayWord);

    return res.json({ ...todayWord, shuffleWords });
  } catch (e) {
    console.log(e);
    saveLog('warn', 'GET', 'today-word', 'system error', { error: e });
    return res.status(500).json({ message: 'something went wrong' });
  }
});

router.get(
  '/learned-words',
  validate(getLearnedWordsSchema),
  async (req, res) => {
    try {
      const user = await getUser(req?.headers?.authorization);

      if (user === 401 || !user) {
        saveLog('error', 'GET', 'last-words', 'no logged user', { user });
        res.status(401).json({ message: 'no logged user' });
        return;
      }

      const { limit, days } = req.query;
      const userId = user?._id.toString();

      const filters: FiltersType = {
        userId,
        status: 2,
      };

      if (days) {
        const limitDay = new Date();
        limitDay.setDate(limitDay.getDate() - Number(days));
        filters.createdDate = { $gte: limitDay };
      }

      const words = await WordModel.find({ filters })
        .sort({ updatedDate: -1 })
        .limit(Number(limit));

      saveLog('info', 'GET', 'last-words', 'get word success', { userId });
      res.json({ words });
    } catch (e) {
      console.log(e);
      saveLog('warn', 'GET', 'last-words', 'system error', { error: e });
      return res.status(500).json({ message: 'something went wrong' });
    }
  }
);

export default router;
