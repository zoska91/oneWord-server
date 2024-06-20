import { describe, it, expect, beforeAll } from 'vitest';
import { Types } from 'mongoose';
import { getShuffleWords } from '../../../utils/words';
import { IWord } from '../../../models/word';
import { ILoggedUser } from '../../../models/user';
import { ModelName, cleanAll } from '../../helpers/cleaner';
import app from '../../testsApp';
import { loginRegularUser } from '../../helpers/auth';

describe('getShuffleWords', () => {
  let user: ILoggedUser;
  let todayWord: IWord;

  beforeAll(async () => {
    await cleanAll([
      ModelName.UserModel,
      ModelName.UserModel,
      ModelName.SubscriptionModel,
    ]);

    user = await loginRegularUser(app);

    todayWord = {
      userId: user.id,
      basicWord: 'TodayBasic',
      transWord: 'Today',
      addLang: 1,
      status: 1,
      createdDate: new Date(),
      updatedDate: new Date(),
      _id: new Types.ObjectId('123456789012345678901234'),
    } as IWord;
  });

  it('should throw an error when words array is empty', () => {
    expect(() => getShuffleWords([], todayWord)).toThrow(
      'No words available to fetch shuffle words'
    );
  });

  it('should return three instances of formattedTodayWord when there is only one word in the array', () => {
    const words: IWord[] = [todayWord];
    const result = getShuffleWords(words, todayWord);

    expect(result).toEqual([
      { id: todayWord._id, text: todayWord.transWord },
      { id: todayWord._id, text: todayWord.transWord },
      { id: todayWord._id, text: todayWord.transWord },
    ]);
  });

  it('should return shuffled words including formattedTodayWord when there are two words in the array', () => {
    const words: IWord[] = [
      todayWord,
      {
        userId: user.id,
        basicWord: 'Basic2',
        transWord: 'Word2',
        addLang: 1,
        status: 1,
        createdDate: new Date(),
        updatedDate: new Date(),
        _id: new Types.ObjectId('223456789012345678901234'),
      } as IWord,
    ];
    const result = getShuffleWords(words, todayWord);

    expect(result).toHaveLength(3);
    expect(result).toContainEqual({
      id: todayWord._id,
      text: todayWord.transWord,
    });
    expect(result).toContainEqual({
      id: words[1]._id,
      text: words[1].transWord,
    });
  });

  it('should return three unique words including formattedTodayWord when there are three or more words in the array', () => {
    const words: IWord[] = [
      todayWord,
      {
        userId: user.id,
        basicWord: 'Basic2',
        transWord: 'Word2',
        addLang: 1,
        status: 1,
        createdDate: new Date(),
        updatedDate: new Date(),
        _id: new Types.ObjectId('223456789012345678901234'),
      } as IWord,
      {
        userId: user.id,
        basicWord: 'Basic3',
        transWord: 'Word3',
        addLang: 1,
        status: 1,
        createdDate: new Date(),
        updatedDate: new Date(),
        _id: new Types.ObjectId('323456789012345678901234'),
      } as IWord,
      {
        userId: user.id,
        basicWord: 'Basic4',
        transWord: 'Word4',
        addLang: 1,
        status: 1,
        createdDate: new Date(),
        updatedDate: new Date(),
        _id: new Types.ObjectId('423456789012345678901234'),
      } as IWord,
    ];
    const result = getShuffleWords(words, todayWord);

    expect(result).toHaveLength(3);
    expect(result).toContainEqual({
      id: todayWord._id,
      text: todayWord.transWord,
    });

    // Ensure that there are no duplicate words
    const uniqueWords = new Set(result.map((word) => word.id.toString()));
    expect(uniqueWords.size).toBe(3);
  });
});
