import { v4 } from 'uuid';
import { Response } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';

import { currentDate } from './currentDate';
import { prompts } from '../chat/prompts';
import { ISaveMessage } from '../chat/types';
import { IMessage, IMistake, INewWord } from './../models/message';
import { IDocumentPayload } from '../chat/qdrant/searchMemories';
import { summaryConversation } from '../chat/promptTemplates/summaryConversation';

export const getMistake = async (
  query: string,
  languageToLearn: string
): Promise<IMistake[]> => {
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

  // @ts-ignore
  return response.map((mistake) => ({ ...mistake, id: v4() }));
};

export const getNewWords = async (
  query: string,
  baseLanguage: string,
  languageToLearn: string
): Promise<INewWord[]> => {
  const chain = RunnableSequence.from([
    {
      query: prompts.correctMessage,
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
  // @ts-ignore
  return response.map((newWord) => ({ ...newWord, id: v4() }));
};

export const getStandaloneQuestionForMemories = async (
  query: string,
  languageToLearn: string
) => {
  const chain = RunnableSequence.from([
    {
      query: prompts.correctMessage,
      original_input: new RunnablePassthrough(),
      languageToLearn: ({ languageToLearn }) => languageToLearn,
    },
    prompts.standaloneQuestionForMemories,
  ]);

  const response = await chain.invoke({
    query,
    languageToLearn,
  });

  return typeof response === 'string' ? response : JSON.stringify(response);
};

export const getCorrectQuery = async (
  query: string,
  languageToLearn: string
) => {
  const chain = prompts.correctMessage();

  const response = await chain.invoke({ query, languageToLearn });

  return typeof response === 'string' ? response : JSON.stringify(response);
};

export const getAiAnswer = async ({
  res,
  messages,
  isStreaming,
  saveMessage,
  dataToSave,
}: {
  res: Response;
  messages: (SystemMessage | HumanMessage | AIMessage)[];
  isStreaming?: boolean;
  saveMessage: (message: ISaveMessage) => void;
  dataToSave: Omit<ISaveMessage, 'aiMessage'>;
}) => {
  const modelSettings = {
    modelName: 'gpt-3.5-turbo',
    streaming: isStreaming ?? false,
    temperature: 0.7,
  };

  const configuration = isStreaming
    ? {
        callbacks: [
          {
            handleLLMNewToken(token: string) {
              res.write(token);
            },
            handleLLMEnd: async (output: any) => {
              const aiMessage = output.generations[0][0].text;
              saveMessage({ ...dataToSave, aiMessage });
              res.end();
            },
          },
        ],
      }
    : undefined;

  const chat = new ChatOpenAI(modelSettings);
  const { content } = await chat.invoke(messages, configuration);

  if (!isStreaming) {
    saveMessage({ ...dataToSave, aiMessage: content.toString() });
    res.json({ answer: content.toString() });
  }
};

export const rerank = async (
  query: string,
  documents: IDocumentPayload[]
): Promise<IDocumentPayload[]> => {
  const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0,
    maxConcurrency: 15,
  });

  const checks: any = [];
  for (const document of documents) {
    checks.push({
      id: document.id,
      rank: model.invoke([
        new SystemMessage(`Check if the following document is relevant to the user query: """${query}""" and may be helpful to answer the question / query. Return 0 if not relevant, 1 if relevant.
          Facts: 
          - Current date and time: ${currentDate()} 
          
          Warning:
            - You're forced to return 0 or 1 and forbidden to return anything else under any circumstances.
            - Pay attention to the keywords from the query, mentioned links etc.
            
            Additional info: 
            Document content: ###${document.content}###
            
            Query:
            `),
        new HumanMessage(query + '### Is relevant (0 or 1):'),
      ]),
    });
  }

  const results = await Promise.all(checks.map((check: any) => check.rank));

  const rankings = results.map((result, index) => {
    return { id: checks[index].id, score: result.content };
  });

  return documents.filter((document: any) =>
    rankings.find(
      (ranking) => ranking.id === document.id && ranking.score === '1'
    )
  );
};

export const getSummaryConversation = async ({
  messages,
  userName,
  aiName,
}: {
  messages: IMessage[];
  userName: string;
  aiName: string;
}) => {
  const model = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    temperature: 0.9,
  });

  const res = await model.invoke([
    new SystemMessage(summaryConversation({ messages, userName, aiName })),
  ]);

  const summary: string = Array.isArray(res.content)
    ? res.content.join(', ')
    : res.content;
  return summary;
};
