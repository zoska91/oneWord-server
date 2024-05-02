import OpenAI from 'openai';

import isUserMistake from '../aiSchemas/isUserMistake';
import { saveLog } from '../logger';

const client = new OpenAI();

export const isMistake = async (languageToLearn: string, message: string) => {
  const resp = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    functions: [isUserMistake(languageToLearn)],
    messages: [{ role: 'user', content: message }],
    function_call: 'auto',
  });
  console.log(resp.choices[0].message);
};

export const convertAudioToText = async (formData: FormData) => {
  try {
    const textResp = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        headers: {
          Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
        },
        method: 'POST',
        body: formData,
      }
    );
    const text = textResp.json();
    console.log(text);
  } catch (e) {
    saveLog('error', 'GET', 'whisper', '', e);
    console.log(e);
  }
};
