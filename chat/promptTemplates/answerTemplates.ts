import { IPromptParams } from '../types';

//  MISTAKES
export const answerWithMistakeTemplate = ({
  userName,
  mistakes,
}: IPromptParams) => `
  Student: ${userName} made mistake: ${mistakes}
  I will tell ${userName} that they made mistake and tell correction. 
  After that given conversation I'll continue conversation. 
  It will sound as natural as possible to keep the immersive experience.
`;

// BASIC ANSWERS
export const answerTemplate = ({ userName, memories }: IPromptParams) => `
  I am in the middle of conversation with ${userName}.
  I'll continue the conversation. It will sound as natural as possible to maintain the immersive experience. 
  If the topic is exhausted or we've been talking about something for a while, try changing the subject by referring to memories, including ${userName}'s hobbies, interesting facts, previous mistakes, etc.  
  memories: ${memories}
`;

export const beginTemplate = ({ userName, memories }: IPromptParams) => `
  Now I'm starting a new conversation. I should say hello to ${userName} and based on the given memories, including ${userName}'s hobbies, interesting facts, previous mistakes, etc., I'll say something that might be interesting for ${userName} and encourage conversation.
  memories: ${memories}
`;

// ANSWERS WITH WORD
export const beginWithWordTemplate = ({
  userName,
  todayWord,
}: IPromptParams) => `
  Now I'm starting a new conversation. I should say hello to ${userName} and tell ${userName} sentence, that could include ${todayWord}, but it won't. Then I'll ask ${userName} to replace a word in the sentence with ${todayWord} - but I WON'T tell this word - and tell whole sentence. 
`;

export const answerWithWordTemplate = ({
  userName,
  todayWord,
}: IPromptParams) => `
  I am in the middle of conversation with ${userName} but we started talking because ${userName} wanted to learn a new word: ${todayWord} and talk about it. If the conversation has just begun, I tell ${userName} that I will now provide a sentence in English that will include placeholder words for ${todayWord}, so that ${userName} can replace the words in the sentence with ${todayWord}. If I see in history messages that ${userName} has correctly replaced the sentence without ${todayWord} with a sentence containing ${todayWord} several times, I'll start a normal conversation, but try to use ${todayWord} as often as possible in my responses or ask a question that allows ${userName} to use it. At the same time, I remember to keep the conversation natural. Come up with a topic that allows for a normal conversation, but also subtly incorporates the word: ${todayWord}.
`;
