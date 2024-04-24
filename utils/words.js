import { saveLog } from '../logger.js'
import { WordModel } from '../models/word.js'

export const getShuffleWords = (words, todayWord) => {
  const firstRandomIndex = Math.floor(Math.random() * words.length)
  const secondRandomIndex = Math.floor(Math.random() * words.length)

  const firstWord = words[firstRandomIndex]
  const secondWord = words[secondRandomIndex]

  const shuffleWords = [firstWord, secondWord]

  const formattedShuffleWords = shuffleWords.map((el) => ({
    id: el._id,
    text: el.transWord,
  }))

  const formattedTodayWord = {
    id: todayWord._id,
    text: todayWord.basicWord,
  }

  return [...formattedShuffleWords, formattedTodayWord]
}

export const getRandomWord = async (words, currentWord) => {
  if (currentWord) {
    await WordModel.findOneAndUpdate(
      { _id: currentWord._id },
      { updatedDate: new Date(), status: 2 },
      { new: false }
    )
  }

  if (!words || words.length === 0) return null

  const randomIndex = Math.floor(Math.random() * words.length)
  const todayWord = words[randomIndex]

  const data = await WordModel.findOneAndUpdate(
    { _id: todayWord._id },
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
