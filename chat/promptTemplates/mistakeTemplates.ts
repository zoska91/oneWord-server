export const punctuationTemplate = `
  Given a sentence, add punctuation where needed. Sentence is in {languageToLearn} language. DO NOT correct grammar mistakes
  sentence: {query}
  sentence with punctuation:
`;

export const correctMessageTemplate = `
  Given a sentence add punctuation where needed and correct the grammar.
  Sentence is in {languageToLearn} language.
  sentence: {query}
  sentence with correct grammar: 
`;

export const grammarTemplate = `Given a message check if it is grammar correct.
  Message is in {languageToLearn} language.
  message: {punctuated_message}
  if message is correct return empty array: []
  if in message there mistake return them as array in json. 
  
  Ignore colloquial expressions, common abbreviations, and everyday informal language used in English. Do not flag these as mistakes.
  IT IS THE MOST IMPORTANT: RESPONSE MUST BE ARRAY OF OBJECT {{"mistake": string, "correction": string}}

  examples with mistakes:: 
  1. I am from about Poland.
  
  ###
  [
    {{
      "mistake": "I am from about Poland",
      "correction": "I am from Poland
    }}
  ]

  2. I'm wandering what should I do.

  ###
  [
    {{
      "mistake": "wandering",
      "correction": "wondering"
    }}
  ]

  3. I'd like to disscouse today about music..

  ###
  [
    {{
      "mistake": "I'd like to disscouse today about music.",
      "correction": "I'd like to discuss music today."
    }},
    {{
      "mistake": "disscouse",
      "correction": "discuss"
    }}
  ]

  examples without mistakes:
  4. I am from Poland 

  ###
  []

  5. I'm gonna do it.

  ###
  []
`;
