import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../testsApp';
import { WordModel } from '../../../models/word';
import { SettingsModel } from '../../../models/settings';
import { ILoggedUser } from '../../../models/user';
import { getUserWithSettings } from '../../helpers/settings';
import { lotOfDifferentWords } from '../../helpers/data';
import { loginExtraUser } from '../../helpers/auth';
import { ModelName, cleanAll } from '../../helpers/cleaner';

type IShuffleWord = {
  id: string;
  text: string;
};

describe('GET /api/words/today-word Endpoint Tests', () => {
  let loggedInUser: ILoggedUser;
  let loggedInExtraUser: ILoggedUser;
  let token: string;

  // break day can't be today
  const breakDay = new Date();
  breakDay.setDate(breakDay.getDate() + 2);
  const breakDayOfWeek = breakDay.getDay();

  beforeAll(async () => {
    await cleanAll([
      ModelName.UserModel,
      ModelName.UserModel,
      ModelName.SubscriptionModel,
    ]);
    loggedInUser = await getUserWithSettings(app);
    loggedInExtraUser = await loginExtraUser(app);
    token = loggedInUser.token;
  });

  beforeEach(async () => {
    await SettingsModel.updateOne(
      { userId: loggedInUser.id },
      { languageToLearn: 3, breakDay: breakDayOfWeek, isBreak: false }
    );

    await WordModel.deleteMany({ userId: loggedInUser.id });
    await WordModel.insertMany(lotOfDifferentWords(loggedInUser));
  });

  it('should fetch today word for authenticated user with one word', async () => {
    await WordModel.deleteMany({ userId: loggedInUser.id });
    await WordModel.create({
      basicWord: 'dom',
      transWord: 'house',
      userId: loggedInUser.id,
      status: 1,
      addLang: 3,
    });

    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('basicWord', 'dom');
    expect(res.body).toHaveProperty('transWord', 'house');
    expect(res.body).toHaveProperty('userId', loggedInUser.id.toString());
    expect(res.body).toHaveProperty('status', 1);
    expect(res.body.shuffleWords.length).toEqual(3);
    res.body.shuffleWords.forEach((word: IShuffleWord) => {
      expect(word).toHaveProperty('id');
      expect(word).toHaveProperty('text');
    });
  });

  it('should fetch today word for authenticated user with two words', async () => {
    await WordModel.deleteMany({ userId: loggedInUser.id });
    await WordModel.insertMany([
      {
        basicWord: 'dom',
        transWord: 'house',
        userId: loggedInUser.id,
        status: 1,
        addLang: 3,
      },
      {
        basicWord: 'kot',
        transWord: 'cat',
        userId: loggedInUser.id,
        status: 0,
        addLang: 3,
      },
    ]);

    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('basicWord', 'dom');
    expect(res.body).toHaveProperty('transWord', 'house');
    expect(res.body).toHaveProperty('userId', loggedInUser.id.toString());
    expect(res.body).toHaveProperty('status', 1);

    // Check shuffleWords
    expect(res.body).toHaveProperty('shuffleWords');
    expect(res.body.shuffleWords).toBeInstanceOf(Array);
    expect(res.body.shuffleWords.length).toEqual(3);

    // Check if shuffleWords contain two identical and one different word
    const shuffleWords = res.body.shuffleWords;
    const uniqueWords = new Set(
      shuffleWords.map((word: IShuffleWord) => word.text)
    );
    expect(uniqueWords.size).toEqual(2);
  });

  it('should fetch today word for authenticated user with three words', async () => {
    await WordModel.deleteMany({ userId: loggedInUser.id });
    await WordModel.insertMany([
      {
        basicWord: 'dom',
        transWord: 'house',
        userId: loggedInUser.id,
        status: 1,
        addLang: 3,
      },
      {
        basicWord: 'kot',
        transWord: 'cat',
        userId: loggedInUser.id,
        status: 0,
        addLang: 3,
      },
      {
        basicWord: 'pies',
        transWord: 'dog',
        userId: loggedInUser.id,
        status: 2,
        addLang: 3,
      },
    ]);

    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('basicWord', 'dom');
    expect(res.body).toHaveProperty('transWord', 'house');
    expect(res.body).toHaveProperty('userId', loggedInUser.id.toString());
    expect(res.body).toHaveProperty('status', 1);

    // Check shuffleWords
    expect(res.body).toHaveProperty('shuffleWords');
    expect(res.body.shuffleWords).toBeInstanceOf(Array);
    expect(res.body.shuffleWords.length).toEqual(3);

    // Check if all shuffleWords are unique
    const shuffleWordsTexts = res.body.shuffleWords.map(
      (word: IShuffleWord) => word.text
    );
    const uniqueShuffleWords = new Set(shuffleWordsTexts);
    expect(uniqueShuffleWords.size).toEqual(3);
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).get('/api/words/today-word');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });

  it('should return message "Today is break day!" if today is break day', async () => {
    await SettingsModel.updateOne(
      { userId: loggedInUser.id },
      { breakDay: new Date().getDay(), isBreak: true }
    );

    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Today is break day!');
  });

  it('should return 404 if no words are available', async () => {
    await WordModel.deleteMany({ userId: loggedInUser.id });

    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'no words');

    await SettingsModel.updateOne(
      { userId: loggedInUser.id },
      { breakDay: new Date().getDay(), isBreak: true }
    );
  });

  it('should fetch today word for authenticated user with ten words', async () => {
    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('basicWord', 'dom');
    expect(res.body).toHaveProperty('transWord', 'house');
    expect(res.body).toHaveProperty('userId', loggedInUser.id.toString());
    expect(res.body).toHaveProperty('status', 1);

    // Check shuffleWords
    expect(res.body).toHaveProperty('shuffleWords');
    expect(res.body.shuffleWords).toBeInstanceOf(Array);
    expect(res.body.shuffleWords.length).toEqual(3);

    // Check if all shuffleWords are unique
    const shuffleWordsTexts = res.body.shuffleWords.map(
      (word: IShuffleWord) => word.text
    );
    const uniqueShuffleWords = new Set(shuffleWordsTexts);
    expect(uniqueShuffleWords.size).toEqual(3);
  });

  it('should fetch a new word if the current word is from yesterday and no word for today', async () => {
    await WordModel.deleteMany({ userId: loggedInUser.id });

    // Create a word from yesterday with status 1
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const oldWord = await WordModel.create({
      basicWord: 'dom',
      transWord: 'house',
      userId: loggedInUser.id,
      status: 1,
      addLang: 3,
      updatedDate: yesterday,
    });

    // Create another word for today
    await WordModel.create({
      basicWord: 'kot',
      transWord: 'cat',
      userId: loggedInUser.id,
      status: 0,
      addLang: 3,
    });

    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('basicWord', 'kot');
    expect(res.body).toHaveProperty('transWord', 'cat');
    expect(res.body).toHaveProperty('userId', loggedInUser.id.toString());
    expect(res.body).toHaveProperty('status', 1);

    // check yesterday word
    const wordFromYesterday = await WordModel.findOne({ _id: oldWord._id });
    expect(wordFromYesterday).toHaveProperty('status', 2);
    expect(wordFromYesterday).toHaveProperty('basicWord', 'dom');
    expect(wordFromYesterday).toHaveProperty('transWord', 'house');

    // Check shuffleWords
    expect(res.body).toHaveProperty('shuffleWords');
    expect(res.body.shuffleWords).toBeInstanceOf(Array);
    expect(res.body.shuffleWords.length).toEqual(3);
  });

  it('should fetch the same word if there is a word with status 1 for today', async () => {
    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('basicWord', 'dom');
    expect(res.body).toHaveProperty('transWord', 'house');
    expect(res.body).toHaveProperty('userId', loggedInUser.id.toString());
    expect(res.body).toHaveProperty('status', 1);

    // Check shuffleWords
    expect(res.body).toHaveProperty('shuffleWords');
    expect(res.body.shuffleWords).toBeInstanceOf(Array);
    expect(res.body.shuffleWords.length).toEqual(3);
  });

  it('should fetch today word even if breakDay is today but isBreak is false', async () => {
    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('basicWord', 'dom');
    expect(res.body).toHaveProperty('transWord', 'house');
    expect(res.body).toHaveProperty('userId', loggedInUser.id.toString());
    expect(res.body).toHaveProperty('status', 1);

    // Check shuffleWords
    expect(res.body).toHaveProperty('shuffleWords');
    expect(res.body.shuffleWords).toBeInstanceOf(Array);
    expect(res.body.shuffleWords.length).toEqual(3);

    // Check if all shuffleWords are unique
    const shuffleWordsTexts = res.body.shuffleWords.map(
      (word: IShuffleWord) => word.text
    );
    const uniqueShuffleWords = new Set(shuffleWordsTexts);
    expect(uniqueShuffleWords.size).toEqual(3);
  });

  it('should not fetch word of another user', async () => {
    // Create a word for extraUser
    await WordModel.create({
      basicWord: 'kot',
      transWord: 'cat',
      userId: loggedInExtraUser.id,
      status: 1,
      addLang: 3,
    });

    // Fetch today's word for loggedInUser
    const res = await request(app)
      .get('/api/words/today-word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('basicWord', 'dom');
    expect(res.body).toHaveProperty('transWord', 'house');
    expect(res.body).toHaveProperty('userId', loggedInUser.id.toString());
    expect(res.body).toHaveProperty('status', 1);
  });
});
