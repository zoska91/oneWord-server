import express from 'express';
import { v4 } from 'uuid';

import { saveLog } from '../logger';
import { getUser } from '../utils/getUser';
import { getConversation } from '../utils/conversation';
import { convertAudioToText, isMistake } from '../utils/openai';

const router = express.Router();

router.post('/message', async (req, res) => {
  const user = await getUser(req.headers.authorization);

  if (user === 401 || !user || !user.isAi) {
    saveLog('error', 'GET', 'auth/user', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }

  const { message, languageToLearn, audio } = req.body;

  // get whole conversation
  const conversationId = (req.headers['x-conversation-id'] as string) || v4();
  const currentConversation = getConversation(conversationId);

  let currentUserMessage = message;
  if (audio) {
    convertAudioToText(audio);
  }

  const isMessageMistake = isMistake(languageToLearn, currentUserMessage);
});
export default router;
