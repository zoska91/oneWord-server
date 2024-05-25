export const punctuationTemplate = `
  Given a sentence, add punctuation where needed. Sentence is in {languageToLearn} language. DO NOT correct grammar mistakes
  sentence: {query}
  sentence with punctuation:
`;

export const grammarTemplate = `Given a message check if it is grammar correct.
  Message is in {languageToLearn} language.
  message: {punctuated_message}
  if message is correct return empty array: []
  if in message there mistake return them as array in json. 
  
  Ignore colloquial expressions, common abbreviations, and everyday informal language used in English. Do not flag these as mistakes.

  examples with mistakes:: 
  1. I am from about Poland.
  
  ###
  [
    {{
      mistake: "I am from about Poland",
      correction: "I am from Poland
    }}
  ]

  2. I'm wandering what should I do.

  ###
  [
    {{
      mistake: "wandering",
      correction: "wondering"
    }}
  ]

  examples without mistakes:
  3. I am from Poland 

  ###
  []

  4. I'm gonna do it.

  ###
  []
`;
