import { ILoggedUser } from '../../models/user';
import { WordModel } from '../../models/word';
import { loginRegularUser } from './auth';

export async function loginAndAddWords(app: any): Promise<ILoggedUser> {
  const user = await loginRegularUser(app);

  const wordsToAdd = [
    { basicWord: 'dom', transWord: 'house', addLang: 7 },
    { basicWord: 'drzewo', transWord: 'tree', addLang: 7 },
    { basicWord: 'kot', transWord: 'cat', addLang: 7 },
    { basicWord: 'pies', transWord: 'dog', addLang: 7 },
    { basicWord: 'słońce', transWord: 'sun', addLang: 7 },
    { basicWord: 'księżyc', transWord: 'moon', addLang: 7 },
    { basicWord: 'książka', transWord: 'book', addLang: 7 },
    { basicWord: 'długopis', transWord: 'pen', addLang: 7 },
    { basicWord: 'komputer', transWord: 'computer', addLang: 7 },
    { basicWord: 'telefon', transWord: 'phone', addLang: 7 },
  ];

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
