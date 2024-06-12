import yup from 'yup';
import { MAX_LENGTH_TODAY_WORD } from './helpers';

export const wordSchema = yup.object({
  body: yup.object({
    basicWord: yup.string().max(MAX_LENGTH_TODAY_WORD).required(),
    transWord: yup.string().max(MAX_LENGTH_TODAY_WORD).required(),
    addLang: yup.number().required(),
    status: yup.number(),
  }),
});

export const deleteWordSchema = yup.object({
  params: yup.object({
    id: yup.number().required(),
  }),
});

export const getLearnedWordsSchema = yup.object({
  query: yup.object({
    limit: yup.number(),
    days: yup.number(),
  }),
});
