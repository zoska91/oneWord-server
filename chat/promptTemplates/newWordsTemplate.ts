export const newWordsTemplate = `
  Message might contain information about new or unknown word/sentence/phrase etc. 

  message is in {languageToLearn} language.
  message: {query}

  A word, sentence, or phrase is considered new or unknown if it is explicitly marked as such in the message. This can be indicated by phrases like "I didn't know that word", "What does it mean", "I didn't know that before", or any similar expressions indicating lack of knowledge or understanding.
  Mistakes, such as typos or grammatical errors, are not new words and should be ignored!
  "Let's discuss about (something)" - it is NOT expression about new word.

  If there is no information about new or unknown word/sentence/phrase etc. then return: []
  If the message contains new or unknown words, sentences, phrases, etc., return them as an ARRAY in JSON with the translated form of each word for {baseLanguage}. 

  IT IS THE MOST IMPORTANT: RESPONSE MUST BE ARRAY OF OBJECT {{"newWord": string, "inBaseLang": string}}

  examples with mistakes:: 
  1. I didn't know that word: dog. Can you explain me?
  
  ###
  [
    {{
      "newWord": "dog",
      "inBaseLang": "pies"
    }}
  ]

  2. What does it mean cat?.

  ###
  [
    {{
      "newWord": "cat",
      "inBaseLang": "kot"
    }}
  ]
  3. That's very nice word: duck. I didn't know that before.

  ###
  [
    {{
      "newWord": "duck",
      "inBaseLang": "kaczka"
    }}
  ]

  examples without mistakes:
  4. I am from Poland 

  ###
  []

`;
