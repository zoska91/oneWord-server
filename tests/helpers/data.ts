import { ILoggedUser } from '../../models/user';

export const wordsToAdd = [
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

export const learnedWordsToAdd = [
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

export const lotOfDifferentWords = (loggedInUser: ILoggedUser) => [
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
  {
    basicWord: 'samochód',
    transWord: 'car',
    userId: loggedInUser.id,
    status: 0,
    addLang: 3,
  },
  {
    basicWord: 'drzewo',
    transWord: 'tree',
    userId: loggedInUser.id,
    status: 0,
    addLang: 3,
  },
  {
    basicWord: 'telefon',
    transWord: 'phone',
    userId: loggedInUser.id,
    status: 0,
    addLang: 3,
  },
  {
    basicWord: 'książka',
    transWord: 'book',
    userId: loggedInUser.id,
    status: 0,
    addLang: 3,
  },
  {
    basicWord: 'komputer',
    transWord: 'computer',
    userId: loggedInUser.id,
    status: 2,
    addLang: 3,
  },
  {
    basicWord: 'chleb',
    transWord: 'bread',
    userId: loggedInUser.id,
    status: 0,
    addLang: 3,
  },
  {
    basicWord: 'kwiat',
    transWord: 'flower',
    userId: loggedInUser.id,
    status: 0,
    addLang: 3,
  },
];

export const prompts = {
  expectedMistakePrompt: `
  Student: User made mistake: [{"id":"1","mistake":"wrong","correction":"right"}]
  I will tell User that they made mistake and tell correction. 
  After that given conversation I'll continue conversation. 
  It will sound as natural as possible to keep the immersive experience.
  `,
  expectedBeginTemplate: `
  Now I'm starting a new conversation. I should say hello to User and based on the given memories, including User's hobbies, interesting facts, previous mistakes, etc., I'll say something that might be interesting for User and encourage conversation.
  memories: Memory 1\nMemory 2\nMemory 3
  `,
  expectedAnswerTemplate: `
  I am in the middle of conversation with User.
  I'll continue the conversation. It will sound as natural as possible to maintain the immersive experience. 
  If the topic is exhausted or we've been talking about something for a while, try changing the subject by referring to memories, including User's hobbies, interesting facts, previous mistakes, etc.  
  memories: Memory 1\nMemory 2\nMemory 3
  `,
  expectedBeginWithWordTemplate: `
  The word that User wants to learn today is: testWord. To help with this, I will create a sentence that includes testWord, but I will replace it with a synonym. I will do this in my mind, then greet User and send the sentence with the synonym along with a request for User to replace the appropriate word in the sentence using testWord. I cannot send testWord in my message.
  `,
  expectedAnswerWithWordTemplate: `
  I am in the middle of conversation with User but we started talking because User wanted to learn a new word: testWord and talk about it. If the conversation has just begun, I tell User that I will now provide a sentence in English that will include placeholder words for testWord, so that User can replace the words in the sentence with testWord. If I see in history messages that User has correctly replaced the sentence without testWord with a sentence containing testWord several times, I'll start a normal conversation, but try to use testWord as often as possible in my responses or ask a question that allows User to use it. At the same time, I remember to keep the conversation natural. Come up with a topic that allows for a normal conversation, but also subtly incorporates the word: testWord.
  `,
};

export const resultsToAdd = [
  {
    createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    correctAnswers: 95,
    badAnswers: 5,
  },
  {
    createdDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    correctAnswers: 80,
    badAnswers: 10,
  },
  {
    createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    correctAnswers: 70,
    badAnswers: 15,
  },
  {
    createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    correctAnswers: 85,
    badAnswers: 5,
  },
  {
    createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    correctAnswers: 60,
    badAnswers: 20,
  },
  {
    createdDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    correctAnswers: 78,
    badAnswers: 12,
  },
  {
    createdDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    correctAnswers: 85,
    badAnswers: 5,
  },
  {
    createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    correctAnswers: 92,
    badAnswers: 8,
  },
  {
    createdDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    correctAnswers: 70,
    badAnswers: 15,
  },
  {
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    correctAnswers: 88,
    badAnswers: 12,
  },
];

export const extraResultsToAdd = [
  {
    createdDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    correctAnswers: 82,
    badAnswers: 10,
  },
  {
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    correctAnswers: 90,
    badAnswers: 8,
  },
  {
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    correctAnswers: 76,
    badAnswers: 12,
  },
  {
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    correctAnswers: 85,
    badAnswers: 5,
  },
  {
    createdDate: new Date(),
    correctAnswers: 92,
    badAnswers: 8,
  },
  {
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    correctAnswers: 87,
    badAnswers: 6,
  },
  {
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    correctAnswers: 75,
    badAnswers: 9,
  },
  {
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    correctAnswers: 80,
    badAnswers: 7,
  },
  {
    createdDate: new Date(),
    correctAnswers: 95,
    badAnswers: 3,
  },
  {
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    correctAnswers: 88,
    badAnswers: 5,
  },
];
