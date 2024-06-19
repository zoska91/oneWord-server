import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import app from '../../testsApp';
import { ILoggedUser } from '../../../models/user';
import { loginRegularUser } from '../../helpers/auth';
import { IWord, WordModel } from '../../../models/word';
import { getRandomWord } from '../../../utils/words';
import { ModelName, cleanAll } from '../../helpers/cleaner';

describe('getRandomWord Function Tests', () => {
  let user: ILoggedUser;

  beforeAll(async () => {
    await cleanAll([
      ModelName.UserModel,
      ModelName.UserModel,
      ModelName.SubscriptionModel,
    ]);

    user = await loginRegularUser(app);
  });

  beforeEach(async () => {
    await WordModel.deleteMany({});
  });

  it('should return null if there are no new words', async () => {
    await WordModel.deleteMany({ userId: user.id });
    const result = await getRandomWord([], null);
    expect(result).toBeNull();
  });

  it('should return a word with status 1 and update the current word to status 2', async () => {
    const currentWord: IWord = new WordModel({
      userId: user.id,
      basicWord: 'test1',
      transWord: 'test1',
      addLang: 1,
      status: 1,
      createdDate: new Date(),
      updatedDate: new Date(),
    });
    await currentWord.save();

    const newWord: IWord = new WordModel({
      userId: user.id,
      basicWord: 'test2',
      transWord: 'test2',
      addLang: 1,
      status: 0,
      createdDate: new Date(),
      updatedDate: new Date(),
    });
    await newWord.save();

    const result = await getRandomWord([newWord], currentWord);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(1);
    expect(result?.basicWord).toBe('test2');
    expect(result?.transWord).toBe('test2');

    const updatedCurrentWord = await WordModel.findById(currentWord._id);
    expect(updatedCurrentWord?.status).toBe(2);
  });

  it('should return null if there are no words with status 0', async () => {
    const newWord: IWord = new WordModel({
      userId: user.id,
      basicWord: 'test1',
      transWord: 'test1',
      addLang: 1,
      status: 1,
      createdDate: new Date(),
      updatedDate: new Date(),
    });
    await newWord.save();

    const result = await getRandomWord([newWord], null);
    expect(result).toBeNull();
  });

  it('should correctly handle the case with multiple new words', async () => {
    const words = [
      {
        userId: user.id,
        basicWord: 'test1',
        transWord: 'test1',
        addLang: 1,
        status: 0,
        createdDate: new Date(),
        updatedDate: new Date(),
      },
      {
        userId: user.id,
        basicWord: 'test2',
        transWord: 'test2',
        addLang: 1,
        status: 0,
        createdDate: new Date(),
        updatedDate: new Date(),
      },
      {
        userId: user.id,
        basicWord: 'test3',
        transWord: 'test3',
        addLang: 1,
        status: 0,
        createdDate: new Date(),
        updatedDate: new Date(),
      },
    ];

    const resp = await WordModel.insertMany(words);
    const result = await getRandomWord(resp, null);

    expect(result).not.toBeNull();
    expect(result?.status).toBe(1);
    expect(result?.basicWord).toMatch(/test[123]/);
  });
});
