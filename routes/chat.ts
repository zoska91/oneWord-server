import express from 'express';
import { v4 } from 'uuid';

import { saveLog } from '../logger';
import { getUser } from '../utils/getUser';
import {
  getMemories,
  getMessages,
  getPrompt,
  saveSummary,
  sendMessageToAi,
} from '../utils/conversation';

import { IMistake, INewWord, MessageModel } from '../models/message';
import {
  getCorrectQuery,
  getMistake,
  getNewWords,
  getSummaryConversation,
} from '../utils/ai';
import { validate } from '../validation';
import { finishConversationSchema, messageSchema } from '../validation/chat';

const router = express.Router();

router.post('/message', validate(messageSchema), async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  if (user === 401 || !user || !user.isAi) {
    saveLog('error', 'POST', 'chat/message', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }

  const {
    query,
    languageToLearn,
    baseLanguage,
    isStreaming,
    todayWord,
    currentConversationId,
  } = req.body;

  const isNewConversation = !Boolean(currentConversationId);
  const conversationId = currentConversationId || v4();
  res.setHeader('x-conversation-id', conversationId);

  const memories = await getMemories({
    userId: user._id.toString(),
    query,
    isNewConversation,
    languageToLearn,
  });

  const mistakes = isNewConversation
    ? []
    : await getMistake(query, languageToLearn);
  const newWords = isNewConversation
    ? []
    : await getNewWords(query, baseLanguage, languageToLearn);
  const correctQuery = isNewConversation
    ? ''
    : await getCorrectQuery(query, languageToLearn);

  const currentPrompt = getPrompt(isNewConversation, {
    aiName: user.aiName,
    userName: user.name,
    languageToLearn,
    memories,
    mistakes,
    todayWord,
  });

  const messages = await getMessages({
    query: correctQuery,
    conversationId,
    currentPrompt,
  });

  await sendMessageToAi({
    query,
    messages,
    mistakes,
    isStreaming,
    conversationId,
    res,
    newWords,
    userId: user._id.toString(),
  });
});

router.post(
  '/finished-conversation',
  validate(finishConversationSchema),
  async (req, res) => {
    const user = await getUser(req?.headers?.authorization);

    if (user === 401 || !user || !user.isAi) {
      saveLog('error', 'POST', 'chat/message', 'no logged user', { user });
      res.status(404).json({ message: 'no logged user' });
      return;
    }
    const { conversationId } = req.body;

    if (!conversationId) {
      saveLog(
        'error',
        'POST',
        'chat/finished-conversation',
        'no conversation',
        {
          user,
        }
      );
      res.status(404).json({ message: 'no conversation' });
      return;
    }

    let mistakes: IMistake[] = [];
    let newWords: INewWord[] = [];

    const messages = await MessageModel.find({ conversationId }).lean();
    messages.forEach((message) => {
      mistakes = [...mistakes, ...message.mistakes];
      newWords = [...newWords, ...message.newWords];
    });

    const summary = await getSummaryConversation({
      messages,
      userName: user.name,
      aiName: user.aiName,
    });

    await saveSummary(summary, user._id.toString(), conversationId);
    res.json({ mistakes, newWords });
  }
);

router.get('/api-key', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  if (user === 401 || !user || !user.isAi) {
    saveLog('error', 'GET', 'auth/user', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }

  res.json(process.env.OPENAI_API_KEY);
});

export default router;
