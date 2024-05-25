import express from 'express';
import { v4 } from 'uuid';

import { saveLog } from '../logger';
import { getUser } from '../utils/getUser';
import {
  getMemories,
  getMessages,
  getPrompt,
  saveMessage,
  saveSummary,
} from '../utils/conversation';
import {
  getAnswerAi,
  getMistakeFromAi,
  getSummaryConversation,
} from '../utils/openai';
import {
  IPromptData,
  currentConversationPrompt,
} from '../chat/prompts/currentConversation';
import { IMistake, INewWord, MessageModel } from '../models/message';
import { getMistake, getNewWords } from '../utils/ai';

const router = express.Router();

router.post('/message', async (req, res) => {
  // const user = await getUser(req?.headers?.authorization);

  // if (user === 401 || !user || !user.isAi) {
  //   saveLog('error', 'POST', 'chat/message', 'no logged user', { user });
  //   res.status(404).json({ message: 'no logged user' });
  //   return;
  // }

  const {
    query,
    languageToLearn,
    baseLanguage,
    isStreaming,
    todayWord,
    currentConversationId,
  } = req.body;

  // const isNewConversation = !Boolean(currentConversationId);
  // const conversationId = currentConversationId || v4();
  // res.setHeader('x-conversation-id', conversationId);

  // // ==== MEMORIES =====
  // const memories = await getMemories(
  //   user._id.toString(),
  //   query,
  //   isNewConversation
  // );

  // // ====== PROMPT =====
  // let currentPrompt = getPrompt(Boolean(isNewConversation), Boolean(todayWord));

  // // ====== MISTAKES =====
  // // is Mistake (initial call if without query - for sure no mistake)
  // const mistakeResp =
  //   query !== ''
  //     ? await getMistakeFromAi({ languageToLearn, query, baseLanguage })
  //     : null;
  // const isMistake = mistakeResp && mistakeResp.isMistake === 1;

  // let mistakes: IMistake[] = [];
  // let newWords: INewWord[] = [];

  // if (isMistake) {
  //   currentPrompt = currentConversationPrompt.withMistake;
  //   mistakes = mistakeResp.mistakes?.map((mistake) => ({
  //     ...mistake,
  //     id: v4(),
  //   }));
  // }

  // if (mistakeResp && mistakeResp.isNewWord === 1) {
  //   newWords = mistakeResp.newWords?.map((newWord) => ({
  //     ...newWord,
  //     id: v4(),
  //   }));
  // }

  // const promptData: IPromptData = {
  //   languageToLearn,
  //   baseLanguage,
  //   memories,
  //   userName: user.name,
  //   aiName: user.aiName,
  //   word: todayWord,
  //   mistakes: mistakes?.map((mistake) => mistake.mistake).join('.'),
  //   isStreaming,
  // };

  // // ==== MESSAGES =====
  // const messages = await getMessages({
  //   query,
  //   conversationId,
  //   currentPrompt: currentPrompt(promptData),
  // });

  // // console.log({ mistakes, messages, query, newWords });
  // // ==== ANSWER + streaming =====
  // const { answer } = await getAnswerAi({
  //   messages,
  //   isStreaming,
  //   res,
  //   conversationId,
  //   query,
  //   mistakes,
  //   newWords,
  //   userId: user._id.toString(),
  //   isMistake: Boolean(isMistake),
  // });
  // // ==== SAVE ANSWER if not streaming =====
  // if (!isStreaming) {
  //   await saveMessage({
  //     conversationId,
  //     humanMessage: query,
  //     aiMessage: answer ?? 'No answer.',
  //     mistakes,
  //     newWords,
  //     userId: user._id.toString(),
  //   });
  //   return res.json({ answer, conversationId });
  // }
  getMistake(query, languageToLearn);
  getNewWords(query, baseLanguage, languageToLearn);
  // else
  res.end();
});

router.post('/finished-conversation', async (req, res) => {
  const user = await getUser(req?.headers?.authorization);

  if (user === 401 || !user || !user.isAi) {
    saveLog('error', 'POST', 'chat/message', 'no logged user', { user });
    res.status(404).json({ message: 'no logged user' });
    return;
  }
  const { conversationId } = req.body;

  if (!conversationId) {
    saveLog('error', 'POST', 'chat/finished-conversation', 'no conversation', {
      user,
    });
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
