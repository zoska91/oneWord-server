import express, { json } from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import csvtojson from 'csvtojson'

import { SettingsModel } from '../models/settings.js'
import { WordModel } from '../models/word.js'
import {
  checkIsBreakDay,
  getRandomWord,
  getShuffleWords,
  isTheSameDates,
} from '../utils/words.js'
import config from '../config.js'
import { saveLog } from '../logger.js'

const router = express.Router()

router.get('/all', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      saveLog('warn', 'GET', 'words/all', 'no token', req.headers.authorization)
      return res.status(401).json({ message: 'no logged user' })
    }

    const { id: userId } = jwt.verify(token, config.secret)
    const words = await WordModel.find({ userId })

    saveLog('info', 'GET', 'words/all', 'get word success', { userId })
    res.json({ words })
  } catch (e) {
    console.log(e)
    saveLog('error', 'GET', 'words/all', 'system error', { error: e })
    res.status(500).json({ message: 'something went wrong' })
  }
})

router.post('/add-one', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      saveLog(
        'warn',
        'POST',
        'words/add-one',
        'no token',
        req.headers.authorization
      )
      return res.status(401).json({ message: 'no logged user' })
    }

    const { id: userId } = jwt.verify(token, config.secret)

    const newWord = new WordModel({ userId, ...req.body })
    newWord.save()
    saveLog('info', 'POST', 'words/add-one', 'add success', {
      userId,
      wordId: newWord._id,
    })
    res.json({ message: 'Success' })
  } catch (e) {
    console.log(e)
    saveLog('info', 'POST', 'words/add-one', 'system error', { error: e })
    res.status(500).json({ message: 'something went wrong' })
  }
})

router.post('/add-csv', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      saveLog(
        'warn',
        'POST',
        'words/add-csv',
        'no token',
        req.headers.authorization
      )
      return res.status(401).json({ message: 'no logged user' })
    }
    const { id: userId } = jwt.verify(token, config.secret)
    const file = req.files?.file

    if (!req.files) {
      saveLog('warn', 'POST', 'words/add-csv', 'no file', { files: req.files })
      res.status(400).send('File was not found')
      return
    }

    csvtojson({ noheader: false, output: 'json' })
      .fromString(file.data.toString('utf8'))
      .then((jsonObj) => {
        jsonObj.forEach((word) => {
          if (!word.basicWord)
            return res.status(400).json({ message: 'wrong basic word key' })
          if (!word.transWord)
            return res.status(400).json({ message: 'wrong transform word key' })

          const newWord = new WordModel({ userId, ...word })

          newWord.save()
        })

        res.json({ message: 'Success' })
      })
      .catch((err) => {
        saveLog('error', 'POST', 'words/add-csv', 'system error [csvToJson]', {
          error: err,
        })

        res.status(500).send(err.message)
      })
  } catch (e) {
    console.log(e)
    saveLog('error', 'POST', 'words/add-csv', 'system error', {
      error: e,
    })
    res.status(500).json({ message: 'something went wrong' })
  }
})

router.put('/update-one/:id', async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id)
    const data = await WordModel.findOneAndUpdate(
      { _id: req.params.id },
      { updatedDate: new Date(), ...req.body },
      { new: true }
    )

    if (!data) {
      saveLog('info', 'PUT', 'words/update-one', 'word not found', {
        wordId: id,
      })

      res.status(404).json({ message: 'word not found' })
      return
    }
    saveLog('info', 'PUT', 'words/update-one', 'update success', { wordId: id })

    res.json(data)
  } catch (e) {
    console.log(e)
    saveLog('error', 'PUT', 'words/update-one', 'system error', {
      error: e,
      wordId: id,
    })

    res.status(500).json({ message: 'something went wrong' })
  }
})

router.delete('/delete-one/:id', async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id)
    const data = await WordModel.findByIdAndDelete({ _id: id })

    saveLog('error', 'DELETE', 'words/delete-one', 'update success', {
      wordId: id,
    })
    res.json(data)
  } catch (e) {
    console.log(e)
    saveLog('error', 'DELETE', 'words/delete-one', 'system error', {
      error: e,
      wordId: id,
    })

    res.status(500).json({ message: 'something went wrong' })
  }
})

router.get('/today-word', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      saveLog(
        'warn',
        'GET',
        'today-word',
        'no token',
        req.headers.authorization
      )
      return res.status(401).json({ message: 'no logged user' })
    }
    const { id: userId } = jwt.verify(token, config.secret)

    const { selectLanguage, breakDay, isBreak } = await SettingsModel.findOne({
      userId,
    })

    if (isBreak && checkIsBreakDay(breakDay))
      return res.json({ message: 'Today is break day!' })

    const currentWord = await WordModel.findOne({ status: 1, userId })
    const allUserWords = await WordModel.find({
      userId,
      addLang: selectLanguage,
    })

    let todayWord =
      currentWord && isTheSameDates(currentWord._doc.updatedDate)
        ? currentWord._doc
        : await getRandomWord(allUserWords, currentWord, userId)

    if (!todayWord) return res.status(404).json({ message: 'no words' })

    const shuffleWords = getShuffleWords(allUserWords, todayWord)

    return res.json({ ...todayWord, shuffleWords })
  } catch (e) {
    console.log(e)
    saveLog('warn', 'GET', 'today-word', 'system error', { error: e })
    return res.status(500).json({ message: 'something went wrong' })
  }
})

export default router
