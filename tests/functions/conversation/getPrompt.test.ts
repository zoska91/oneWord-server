import { describe, it, expect, beforeEach } from 'vitest';
import { IPromptParams } from '../../../chat/types';
import { getPrompt } from '../../../utils/conversation';
import { prompts } from '../../helpers/data';

describe('getPrompt Function Tests', () => {
  let promptParams: IPromptParams;

  beforeEach(() => {
    promptParams = {
      aiName: 'AI Bot',
      userName: 'User',
      languageToLearn: 'English',
      memories: 'Memory 1\nMemory 2\nMemory 3',
      mistakes: [],
    };
  });

  it('should return answerWithMistakeTemplate prompt when there are mistakes', () => {
    promptParams.mistakes = [
      { id: '1', mistake: 'wrong', correction: 'right' },
    ];

    const result = getPrompt(false, promptParams);
    expect(result.trim()).toBe(prompts.expectedMistakePrompt.trim());
  });

  it('should return beginTemplate prompt for a new conversation without todayWord', () => {
    const result = getPrompt(true, promptParams);
    expect(result.trim()).toBe(prompts.expectedBeginTemplate.trim());
  });

  it('should return answerTemplate prompt for an ongoing conversation without todayWord', () => {
    const result = getPrompt(false, promptParams);
    expect(result.trim()).toBe(prompts.expectedAnswerTemplate.trim());
  });

  it('should return beginWithWordTemplate prompt for a new conversation with todayWord', () => {
    promptParams.todayWord = 'testWord';

    const result = getPrompt(true, promptParams);
    expect(result.trim()).toBe(prompts.expectedBeginWithWordTemplate.trim());
  });

  it('should return answerWithWordTemplate prompt for an ongoing conversation with todayWord', () => {
    promptParams.todayWord = 'testWord';

    const result = getPrompt(false, promptParams);
    expect(result.trim()).toBe(prompts.expectedAnswerWithWordTemplate.trim());
  });
});
