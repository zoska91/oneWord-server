import { WordModel } from '../models/word.js'

export const getShuffleWords = (words) => {
  const shuffleWords = []

  while (shuffleWords.length < 3) {
    const randomIndex = Math.floor(Math.random() * words.length)
    if (!shuffleWords.includes(words[randomIndex]))
      shuffleWords.push(words[randomIndex])
  }

  const formattedShuffleWords = shuffleWords.map((el) => ({
    id: el._id,
    text: el.transWord,
  }))

  return formattedShuffleWords
}

export const getRandomWord = async (words) => {
  if (!words) return { message: 'There is no more words to learn' }

  const randomIndex = Math.floor(Math.random() * words.length)
  const todayWord = words[randomIndex]

  const data = await WordModel.findOneAndUpdate(
    { _id: todayWord.id },
    { updatedDate: new Date(), status: 1 },
    { new: true }
  )

  return data
}

export const checkIsBreakDay = (breakDay) => {
  const todayDate = new Date()
  const todayDay = todayDate.getDay()
  return +breakDay === +todayDay
}
