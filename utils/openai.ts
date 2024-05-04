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

const client = new OpenAI();

export const getMistakeFromAi = async (
  languageToLearn: string,
  message: string
) => {
  console.log('getMistakeFromAi', { languageToLearn, message });
  const resp = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    functions: [isUserMistake(languageToLearn)],
    messages: [{ role: 'user', content: message }],
    function_call: 'auto',
  });
  console.log('getMistakeFromAi', resp.choices[0].message);

  const dataJSON = resp.choices[0].message?.function_call?.arguments;
  const data = dataJSON ? JSON.parse(dataJSON) : '';

  return data;
};

export const getAnswerAi = async ({
  messages,
  isStreaming,
  conversationId,
  res,
  query,
}: {
  messages: (SystemMessage | HumanMessage | AIMessage)[];
  isStreaming?: boolean;
  conversationId: string;
  res: Response;
  query: string;
}) => {
  const modelSettings = {
    modelName: 'gpt-3.5-turbo',
    streaming: isStreaming ?? false,
    temperature: 0.7,
  };
  console.log({ messages, isStreaming, conversationId, res, query });
  const configuration = isStreaming
    ? {
        callbacks: [
          {
            handleLLMNewToken(token: string) {
              console.log({ token });
              res.write(token);
            },
            handleLLMEnd: async (output: any) => {
              await saveMessage({
                conversationId,
                humanMessage: query,
                aiMessage: output.generations[0][0].text,
              });
            },
          },
        ],
      }
    : undefined;

  const chat = new ChatOpenAI(modelSettings);
  const { content } = await chat.invoke(messages, configuration);
  console.log({ content });
  return {
    answer: typeof content === 'string' ? content : null,
  };
};

export const getSummaryConversation = () => {
  
}

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
