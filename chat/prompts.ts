import { ChatOpenAI } from '@langchain/openai';
import {
  StringOutputParser,
  JsonOutputParser,
} from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';

import {
  correctMessageTemplate,
  grammarTemplate,
  newWordsTemplate,
  punctuationTemplate,
  standaloneQuestionForMemoriesTemplate,
} from './promptTemplates';

const llm = (model: string = 'gpt-3.5-turbo') =>
  new ChatOpenAI({ model, temperature: 0.6, topP: 0.8 });

export const prompts = {
  punctuation: () => {
    const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);

    return RunnableSequence.from([
      punctuationPrompt,
      llm(),
      new StringOutputParser(),
    ]);
  },
  grammar: () => {
    const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate);

    return RunnableSequence.from([
      grammarPrompt,
      llm('gpt-4o'),
      new JsonOutputParser(),
    ]);
  },
  correctMessage: () => {
    const correctMessagePrompt = PromptTemplate.fromTemplate(
      correctMessageTemplate
    );

    return RunnableSequence.from([
      correctMessagePrompt,
      llm(),
      new StringOutputParser(),
    ]);
  },
  newWords: () => {
    const newWordsPrompt = PromptTemplate.fromTemplate(newWordsTemplate);

    return RunnableSequence.from([
      newWordsPrompt,
      llm(),
      new JsonOutputParser(),
    ]);
  },
  standaloneQuestionForMemories: () => {
    const newWordsPrompt = PromptTemplate.fromTemplate(
      standaloneQuestionForMemoriesTemplate
    );

    return RunnableSequence.from([
      newWordsPrompt,
      llm(),
      new StringOutputParser(),
    ]);
  },
};
