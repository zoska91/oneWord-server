import { ILoggedUser } from '../../models/user';
import { WordModel } from '../../models/word';
import { loginRegularUser } from './auth';
import { learnedWordsToAdd, wordsToAdd } from './data';

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
