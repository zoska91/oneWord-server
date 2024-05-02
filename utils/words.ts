import { saveLog } from '../logger';
import { IWord, WordModel } from '../models/word';

export const getShuffleWords = (words: IWord[], todayWord: IWord) => {
  const formattedTodayWord = {
    id: todayWord._id,
    text: todayWord.transWord,
  };

  const firstRandomIndex = Math.floor(Math.random() * words.length);
  const secondRandomIndex = Math.floor(Math.random() * words.length);

  const firstWord = words[firstRandomIndex];
  const secondWord =
    firstRandomIndex === secondRandomIndex
      ? words[secondRandomIndex + 1]
      : words[secondRandomIndex];

  if (!firstWord || !secondWord) {
    saveLog('error', 'GET', 'getShuffleWords', 'no words', {
      firstWord,
      secondWord,
    });
    return [formattedTodayWord, formattedTodayWord, formattedTodayWord];
  }
  const shuffleWords = [firstWord, secondWord];

  const formattedShuffleWords = shuffleWords.map((el) => ({
    id: el?._id,
    text: el?.transWord,
  }));

  return [...formattedShuffleWords, formattedTodayWord];
};

export const getRandomWord = async (
  words: IWord[],
  currentWord: IWord | null
): Promise<IWord | null> => {
  if (currentWord) {
    await WordModel.findOneAndUpdate(
      { _id: currentWord._id },
      { updatedDate: new Date(), status: 2 },
      { new: false }
    );
  }

  const wordsToLearn = words.filter((word) => word.status === 0);
  const randomIndex = Math.floor(Math.random() * wordsToLearn.length);
  const todayWord = wordsToLearn?.[randomIndex];

  if (!todayWord) return null;

  const data = await WordModel.findOneAndUpdate(
    { _id: todayWord._id },
    { updatedDate: new Date(), status: 1 },
    { new: true }
  );
  if (!data) return null;

  return data.toObject();
};

export const checkIsBreakDay = (breakDay: number) => {
  const todayDate = new Date();
  const todayDay = todayDate.getDay();
  return +breakDay === +todayDay;
};

export const isTheSameDates = (wordDate: Date) => {
  const date1 = new Date(wordDate);
  const date2 = new Date();

  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  if (date1.getTime() === date2.getTime()) return true;
  else return false;
};