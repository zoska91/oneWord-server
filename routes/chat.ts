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
import { getAnswerAi, getMistakeFromAi } from '../utils/openai';
import { currentConversationPrompt } from '../chat/prompts/currentConversation';

const router = express.Router();

router.post('/message', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  if (user === 401 || !user || !user.isAi) {
    saveLog('error', 'POST', 'chat/message', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }
  console.log(req.body);

  const { query, languageToLearn, isStreaming, todayWord } = req.body;

  // get whole conversation
  const isNewConversation = req.headers['x-new-conversation'];
  const conversationId = (req.headers['x-conversation-id'] as string) || v4();

  // get prompt
  let currentPrompt = getPrompt(Boolean(isNewConversation), Boolean(todayWord));

  // is mistake?
  const mistakeResp = getMistakeFromAi(languageToLearn, query);

  if (!mistakeResp) {
    saveLog('error', 'POST', 'chat/message', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }
  const { isMistake } = await mistakeResp;

  if (isMistake === 1) {
    currentPrompt = currentConversationPrompt.withMistake;
  }

  // get memories
  const memories = getMemories(user._id.toString());
  res.setHeader('x-conversation-id', conversationId);

  const messages = await getMessages({
    query,
    conversationId,
    currentPrompt: currentPrompt(memories, languageToLearn),
  });

  const { answer } = await getAnswerAi({
    messages,
    isStreaming,
    res,
    conversationId,
    query,
  });

  if (!isStreaming) {
    await saveMessage({
      conversationId,
      humanMessage: query,
      aiMessage: answer ?? 'No answer.',
    });
    return res.json({ answer, conversationId });
  } else res.end();
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
export default router;
