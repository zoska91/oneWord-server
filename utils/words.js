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
    text: todayWord.transWord,
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
  const wordsToLearn = words.filter((word) => word.status === 0)
  const randomIndex = Math.floor(Math.random() * wordsToLearn.length)
  const todayWord = wordsToLearn?.[randomIndex]
  console.log({ todayWord })
  if (!todayWord) return null

  const data = await WordModel.findOneAndUpdate(
    { _id: todayWord._id },
    { updatedDate: new Date(), status: 1 },
    { new: true }
  )
  if (!data) return null

  return data._doc
}

export const checkIsBreakDay = (breakDay) => {
  const todayDate = new Date()
  const todayDay = todayDate.getDay()
  return +breakDay === +todayDay
}

export const isTheSameDates = (wordDate) => {
  const date1 = new Date(wordDate)
  const date2 = new Date()

  date1.setHours(0, 0, 0, 0)
  date2.setHours(0, 0, 0, 0)

  if (date1.getTime() === date2.getTime()) true
  else false
}
