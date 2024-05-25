export const newWordsTemplate = `Message might contain information about new or unknown   word/sentence/phrase etc. Check it!

  message is in {languageToLearn} language.
  message: {punctuated_message}
  If there is no information about new or unknow word/sentence/phrase etc. then return: []
  If the message contains new or unknown words, sentences, phrases, etc., return them as an ARRAY in JSON with the translated form of each word for {baseLanguage}. 

  examples with mistakes:: 
  1. I didn't know that word: dog. Can you explain me?
  
  ###
  [
    {{
      newWord: "dog",
      inBaseLang: "pies"
    }}
  ]

  2. What does it mean cat?.

  ###
  [
    {{
      newWord: "cat",
      inBaseLang: "kot"
    }}
  ]
  3. That's very nice word: duck. I didn't know that before.

  ###
  [
    {{
      newWord: "duck",
      inBaseLang: "kaczka"
    }}
  ]

  examples without mistakes:
  4. I am from Poland 

  ###
  []

`;
