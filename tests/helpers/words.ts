import { ResultModel } from '../../models/result';
import { ILoggedUser } from '../../models/user';
import { WordModel } from '../../models/word';
import { loginExtraUser, loginRegularUser } from './auth';
import {
  extraResultsToAdd,
  learnedWordsToAdd,
  resultsToAdd,
  wordsToAdd,
} from './data';

export async function loginAndAddWords(app: any): Promise<ILoggedUser> {
  const user = await loginRegularUser(app);

  const promises = wordsToAdd.map(async (wordData) => {
    const newWord = new WordModel({
      userId: user.id,
      ...wordData,
    });

    await newWord.save();
  });

  await Promise.all(promises);

  return user;
}

export async function getUserWithLearnedWords(app: any): Promise<ILoggedUser> {
  const user = await loginRegularUser(app);

  const promises = learnedWordsToAdd.map(async (wordData) => {
    const newWord = new WordModel({
      userId: user.id,
      ...wordData,
    });

    await newWord.save();
  });

  await Promise.all(promises);

  return user;
}

export async function loginAndAddResults(app: any): Promise<ILoggedUser> {
  const user = await loginRegularUser(app);
  const extraUser = await loginExtraUser(app);
  console.log({ user, extraUser });
  const promises = resultsToAdd.map(async (wordData) => {
    const newWord = new ResultModel({
      userId: user.id,
      ...wordData,
    });

    await newWord.save();
  });

  const extraPromises = extraResultsToAdd.map(async (wordData) => {
    const newWord = new ResultModel({
      userId: extraUser.id,
      ...wordData,
    });

    await newWord.save();
  });

  await Promise.all([...promises, ...extraPromises]);

  return user;
}
