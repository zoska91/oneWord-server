import { IWord, WordModel } from '../models/word';

export const getShuffleWords = (words: IWord[], todayWord: IWord) => {
  const formattedTodayWord = {
    id: todayWord._id,
    text: todayWord.transWord,
  };

  if (words.length === 0) {
    throw new Error('No words available to fetch shuffle words');
  }

  // Case 1: One word
  if (words.length === 1) {
    return [formattedTodayWord, formattedTodayWord, formattedTodayWord];
  }

  // Case 2: Two words
  if (words.length === 2) {
    const randomIndex = Math.floor(Math.random() * 2);
    const firstWord = words[0];
    const secondWord = words[1];

    const shuffleWords = [
      randomIndex === 0 ? firstWord : secondWord,
      firstWord === secondWord ? firstWord : secondWord,
    ].map((word) => ({
      id: word._id,
      text: word.transWord,
    }));

    return [...shuffleWords, formattedTodayWord];
  }

  // Case 3: Three or more words
  const uniqueIndices = new Set<number>();
  const wordsWithoutTodayWord = words.filter(
    (word) => word._id.toString() !== todayWord._id.toString()
  );

  // Ensure we get 3 unique indices
  while (uniqueIndices.size < 2) {
    uniqueIndices.add(Math.floor(Math.random() * wordsWithoutTodayWord.length));
  }

  const indicesArray = Array.from(uniqueIndices);
  const shuffleWords = indicesArray.map((index) => ({
    id: wordsWithoutTodayWord[index]._id,
    text: wordsWithoutTodayWord[index].transWord,
  }));

  return [...shuffleWords, formattedTodayWord];
};

export const getRandomWord = async (
  newWords: IWord[],
  currentWord: IWord | null
): Promise<IWord | null> => {
  if (currentWord) {
    await WordModel.findOneAndUpdate(
      { _id: currentWord._id },
      { updatedDate: new Date(), status: 2 },
      { new: false }
    );
  }

  const wordsToLearn = newWords.filter((word) => word.status === 0);
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
  const todayDateOfWeek = todayDate.getDay();

  return breakDay === todayDateOfWeek;
};

export const isTheSameDates = (wordDate: Date) => {
  const date1 = new Date(wordDate);
  const date2 = new Date();

  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  if (date1.getTime() === date2.getTime()) return true;
  else return false;
};
