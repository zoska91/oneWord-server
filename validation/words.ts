import yup from 'yup';
import { MAX_LENGTH_TODAY_WORD } from './helpers';

export const addWordSchema = yup.object({
  body: yup.object({
    basicWord: yup.string().max(MAX_LENGTH_TODAY_WORD).required(),
    transWord: yup.string().max(MAX_LENGTH_TODAY_WORD).required(),
    addLang: yup.number().required(),
    status: yup.number(),
  }),
});

export const putWordSchema = yup.object({
  body: yup.object({
    basicWord: yup.string().max(MAX_LENGTH_TODAY_WORD),
    transWord: yup.string().max(MAX_LENGTH_TODAY_WORD),
    addLang: yup.number(),
    status: yup.number(),
  }),
  params: yup.object({
    id: yup.string().required(),
  }),
});

export const deleteWordSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
});

export const getLearnedWordsSchema = yup.object({
  query: yup.object({
    limit: yup.number().required(),
    days: yup.number(),
  }),
});

export const addResultsSchema = yup.object({
  body: yup.object({
    correctAnswers: yup.number().required(),
    badAnswers: yup.number().required(),
  }),
});

export const getResultsSchema = yup.object({
  query: yup.object({
    date: yup.string(),
  }),
});
