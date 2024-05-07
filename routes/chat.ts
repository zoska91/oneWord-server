import express from 'express';
import { v4 } from 'uuid';

import { saveLog } from '../logger';
import { getUser } from '../utils/getUser';
import {
  getMemories,
  getMessages,
  getPrompt,
  saveMessage,
} from '../utils/conversation';
import {
  getAnswerAi,
  getMistakeFromAi,
  getSummaryConversation,
} from '../utils/openai';
import { currentConversationPrompt } from '../chat/prompts/currentConversation';
import { IMistake, MessageModel } from '../models/message';

const router = express.Router();

router.post('/message', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  if (user === 401 || !user || !user.isAi) {
    saveLog('error', 'POST', 'chat/message', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }
  console.log(req.body);

  const {
    query,
    languageToLearn,
    isStreaming,
    todayWord,
    currentConversationId,
  } = req.body;
  console.log({ query, languageToLearn, isStreaming, todayWord });

  const isNewConversation = !Boolean(currentConversationId);
  const conversationId = currentConversationId || v4();
  res.setHeader('x-conversation-id', conversationId);

  console.log({
    isNewConversation,
    conversationId,
    headers: req.headers['x-new-conversation'],
  });
  // ====== PROMPT =====
  let currentPrompt = getPrompt(Boolean(isNewConversation), Boolean(todayWord));

  // ====== MISTAKES =====
  // is Mistake (initial call if without query - for sure no mistake)
  const mistakeResp =
    query !== '' ? await getMistakeFromAi(languageToLearn, query) : null;

  let mistakes: IMistake[] = [];
  if (mistakeResp && mistakeResp.isMistake === 1) {
    currentPrompt = currentConversationPrompt.withMistake;
    mistakes = mistakeResp.mistakes.map((mistake) => ({
      ...mistake,
      id: v4(),
    }));
  }

  // ==== MEMORIES =====
  const memories = await getMemories(user._id.toString(), query);
  console.log('********');
  console.log({ memories });

  // ==== MESSAGES =====
  const messages = await getMessages({
    query,
    conversationId,
    currentPrompt: currentPrompt(memories, languageToLearn),
  });

  // ==== ANSWER + streaming =====
  const { answer } = await getAnswerAi({
    messages,
    isStreaming,
    res,
    conversationId,
    query,
    mistakes,
  });

  // ==== SAVE ANSWER if not streaming =====
  if (!isStreaming) {
    await saveMessage({
      conversationId,
      humanMessage: query,
      aiMessage: answer ?? 'No answer.',
      mistakes,
    });
    return res.json({ answer, conversationId });
  } else res.end();
});

router.get('finished-conversation', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  if (user === 401 || !user || !user.isAi) {
    saveLog('error', 'POST', 'chat/message', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }

  const conversationId = (req.headers['x-conversation-id'] as string) || v4();
  if (!conversationId) {
    saveLog('error', 'POST', 'chat/finished-conversation', 'no conversation', {
      user,
    });
    res.status(404).json({ message: 'no conversation' });
    return;
  }

  const messages = await MessageModel.find({ conversationId }).lean();
  const summary = getSummaryConversation(messages);
});

router.get('/api-key', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  if (user === 401 || !user || !user.isAi) {
    saveLog('error', 'GET', 'auth/user', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }

  res.json(process.env.OPENAI_API_KEY);
});

router.get('/is-ai', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);
  if (user === 401 || !user) {
    saveLog('error', 'GET', 'chat/is_ai', 'no logged user', { user });
    res.redirect('/');
    return;
  }

  const { isAi } = user;
  if (!isAi) {
    saveLog('error', 'GET', 'chat/is_ai', 'no AI', { user });
    res.redirect('/');
    return;
  }

  res.end();
});
export default router;
