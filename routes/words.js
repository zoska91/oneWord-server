import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

import { SettingsModel } from '../models/settings.js'
import { WordModel } from '../models/word.js'
import {
  checkIsBreakDay,
  getRandomWord,
  getShuffleWords,
} from '../utils/words.js'
import config from '../config.js'

const router = express.Router()

router.get('/all', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'no logged user' })

    const { id: userId } = jwt.verify(token, config.secret)
    const words = await WordModel.find({ userId })

    res.json({ words })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'something went wrong' })
  }
})

router.post('/add-one', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'no logged user' })

    const { id: userId } = jwt.verify(token, config.secret)

    const newWord = new WordModel({ userId, ...req.body })

    newWord.save()

    res.json({ message: 'Success' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'something went wrong' })
  }
})

router.put('/update-one/:id', async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id)

    const data = await WordModel.findOneAndUpdate(
      { _id: id },
      { updatedDate: new Date(), ...req.body },
      { new: true }
    )

    res.json(data)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'something went wrong' })
  }
})

router.delete('/delete-one/:id', async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id)
    const data = await WordModel.findByIdAndDelete(
      { _id: id },
    )

    res.json(data)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'something went wrong' })
  }
})

router.get('/today-word', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'no logged user' })

    const { id: userId } = jwt.verify(token, config.secret)
    const { selectLanguage, breakDay, isBreak } = await SettingsModel.findOne({
      userId,
    })

    if (isBreak && checkIsBreakDay(breakDay))
      return res.json({ message: 'Today is break day!' })

    const words = await WordModel.find({ userId, addLang: selectLanguage })

    const shuffleWords = getShuffleWords(words)

    const chosenWord = await WordModel.findOne({ status: 1, userId })
    if (chosenWord) return res.json({ ...chosenWord._doc, shuffleWords })

    const resp = await getRandomWord(words)

    res.json({ ...resp, shuffleWords })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'something went wrong' })
  }
})

export default router
