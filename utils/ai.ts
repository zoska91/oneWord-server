import { newWordsTemplate } from './../chat/prompts/newWordsTemplate';
import { ChatOpenAI } from '@langchain/openai';
import {
  StringOutputParser,
  JsonOutputParser,
} from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import {
  grammarTemplate,
  punctuationTemplate,
} from './../chat/prompts/mistakeTemplate';

const llm = (model: string = 'gpt-3.5-turbo') => new ChatOpenAI({ model });

const prompts = {
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
  newWords: () => {
    const newWordsPrompt = PromptTemplate.fromTemplate(newWordsTemplate);
    return RunnableSequence.from([
      newWordsPrompt,
      llm('gpt-4o'),
      new JsonOutputParser(),
    ]);
  },
};

export const getMistake = async (query: string, languageToLearn: string) => {
  const chain = RunnableSequence.from([
    {
      punctuated_message: prompts.punctuation,
      original_input: new RunnablePassthrough(),
      languageToLearn: ({ languageToLearn }) => languageToLearn,
    },
    prompts.grammar,
  ]);

  const response = await chain.invoke({
    query,
    languageToLearn,
  });

  return response;
};

export const getNewWords = async (
  query: string,
  baseLanguage: string,
  languageToLearn: string
) => {
  const chain = RunnableSequence.from([
    {
      punctuated_message: prompts.punctuation,
      original_input: new RunnablePassthrough(),
      languageToLearn: ({ languageToLearn }) => languageToLearn,
      baseLanguage: ({ baseLanguage }) => baseLanguage,
    },
    prompts.newWords,
  ]);

  const response = await chain.invoke({
    query,
    languageToLearn,
    baseLanguage,
  });

  return response;
};
