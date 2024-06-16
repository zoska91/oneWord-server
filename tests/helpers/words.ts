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

export async function getUserWithLearnedWords(app: any): Promise<ILoggedUser> {
  const user = await loginRegularUser(app);

  const wordsToAdd = [
    {
      basicWord: 'dom',
      transWord: 'house',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'drzewo',
      transWord: 'tree',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'kot',
      transWord: 'cat',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'pies',
      transWord: 'dog',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'słońce',
      transWord: 'sun',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'księżyc',
      transWord: 'moon',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'książka',
      transWord: 'book',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'długopis',
      transWord: 'pen',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'komputer',
      transWord: 'computer',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'telefon',
      transWord: 'phone',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'kwiat',
      transWord: 'flower',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'rower',
      transWord: 'bike',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'chleb',
      transWord: 'bread',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'samolot',
      transWord: 'airplane',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'buty',
      transWord: 'shoes',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'okno',
      transWord: 'window',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'miejsce',
      transWord: 'place',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'brama',
      transWord: 'gate',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'kawa',
      transWord: 'coffee',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'patelnia',
      transWord: 'frying pan',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
    },
    {
      basicWord: 'ser',
      transWord: 'cheese',
      addLang: 7,
      status: 2,
      createdDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
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
