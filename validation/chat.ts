import yup from 'yup';
import { MAX_LENGTH_LANGUAGE_TO_LEARN, MAX_LENGTH_TODAY_WORD } from './helpers';

export const messageSchema = yup.object({
  body: yup.object({
    query: yup.string().max(1024),
    languageToLearn: yup.string().max(MAX_LENGTH_LANGUAGE_TO_LEARN).required(),
    isStreaming: yup.bool(),
    todayWord: yup.string().max(MAX_LENGTH_TODAY_WORD),
    currentConversationId: yup.string().nullable(),
  }),
});

export const finishConversationSchema = yup.object({
  body: yup.object({
    currentConversationId: yup.string().required(),
  }),
});
