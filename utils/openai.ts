import OpenAI from 'openai';
import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';

import { Response } from 'express';

import isUserMistake from '../chat/aiSchemas/isUserMistake';
import { saveLog } from '../logger';
import { saveMessage } from './conversation';
import { currentDate } from './currentDate';
import { IMessage, IMistake, INewWord } from '../models/message';
import { summaryConversation } from '../chat/prompts/summaryConversation';
import { IDocumentPayload } from '../chat/qdrant/searchmemories';

interface IMistakeAiResp {
  isMistake: 1 | 0;
  isNewWord: 1 | 0;
  mistakes: { mistake: string; correction: string }[];
  newWords: { word: string }[];
}

const client = new OpenAI();

export const getMistakeFromAi = async (
  languageToLearn: string,
  message: string
): Promise<IMistakeAiResp | null> => {
  const resp = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    functions: [isUserMistake(languageToLearn)],
    messages: [{ role: 'user', content: message }],
    function_call: 'auto',
  });

  const dataJSON = resp.choices[0].message?.function_call?.arguments;
  const data: IMistakeAiResp | null = dataJSON ? JSON.parse(dataJSON) : null;

  return data;
};

export const getAnswerAi = async ({
  messages,
  isStreaming,
  conversationId,
  res,
  query,
  mistakes,
  newWords,
  userId,
  isMistake,
}: {
  messages: (SystemMessage | HumanMessage | AIMessage)[];
  isStreaming?: boolean;
  conversationId: string;
  res: Response;
  query: string;
  mistakes: IMistake[];
  newWords: INewWord[];
  userId: string;
  isMistake: boolean;
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
              await saveMessage({
                conversationId,
                humanMessage: query,
                aiMessage: output.generations[0][0].text,
                mistakes,
                newWords,
                userId,
              });
            },
          },
        ],
      }
    : undefined;

  const chat = new ChatOpenAI(modelSettings);
  const { content } = await chat.invoke(messages, configuration);
  return {
    answer: typeof content === 'string' ? content : null,
  };
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
// export const convertAudioToText = async (formData: FormData) => {
//   try {
//     const textResp = await fetch(
//       'https://api.openai.com/v1/audio/transcriptions',
//       {
//         headers: {
//           Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
//         },
//         method: 'POST',
//         body: formData,
//       }
//     );
//     const text = await textResp.json();
//     console.log(text);
//   } catch (e) {
//     saveLog('error', 'GET', 'whisper', '', e);
//     console.log(e);
//   }
// };
