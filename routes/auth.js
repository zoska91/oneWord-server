import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { UserModel } from '../models/user.js'
import config from '../config.js'
import { SettingsModel } from '../models/settings.js'
import { saveLog } from '../logger.js'

const router = express.Router()

router.get('/user', async (req, res) => {
  saveLog('info', 'GET', 'auth/user', 'test', { test: 'test' })

  if (!req.headers?.authorization) {
    return res.status(401).json({ message: 'no logged user' })
  }

  const token = req.headers.authorization.split(' ')[1]
  if (token === 'undefined') {
    return res.status(401).json({ message: 'no logged user' })
  }

  const { username, id, name } = jwt.verify(token, 'abfewvsdvarebr')

  if (username && id) {
    saveLog('info', 'GET', 'auth/user', 'user logged', { userId: id })
    res.json({ username, id, name })
  } else {
    saveLog('error', 'GET', 'auth/user', 'no logged user', { userId: id })
    res.status(404).json({ message: 'no logged user' })
  }
})

router.post('/login', async (req, res) => {
  console.log(11111)
  const { username, password } = req.body

  try {
    const data = await UserModel.findOne({ username })
    if (!data) {
      saveLog('warn', 'POST', 'auth/login', 'no username', { username })
      return res.status(404).send({ message: 'Email not found' })
    }

    bcrypt.compare(password, data.password, (err, result) => {
      if (result) {
        var token = jwt.sign(
          { id: data._id, username: data.username, name: data.name },
          'abfewvsdvarebr'
        )

        saveLog('info', 'POST', 'auth/login: login success', {
          userId: data._id,
        })

        res.status(200).send({
          message: 'Login Successful',
          email: result.email,
          token,
        })
      } else {
        saveLog('warn', 'POST', 'auth/login: wrong password', {
          userId: data._id,
        })

        return res.status(400).send({
          message: 'Incorrect username or password.',
        })
      }
    })
  } catch (err) {
    if (err) {
      console.log(err)
      saveLog('error', 'POST', 'auth/login: system error', { error: err })

      res.status(500).send({
        message: 'Something went wrong',
      })
    }
  }
})

router.post('/register', async (req, res) => {
  try {
    const { username, password, name } = req.body
    const findUser = await UserModel.findOne({ username })

    if (findUser) {
      saveLog('info', 'POST', 'auth/register: user exists', { username })

      return res
        .status(400)
        .json({ message: 'this user is already in the database' })
    }

    const hash = await bcrypt.hash(password, config.saltRounds)

    if (!hash) {
      saveLog('info', 'POST', 'auth/register: hash issue')
      return res.status(500).json('Something is wrong with your password')
    }

    const newUser = new UserModel({
      username,
      password: hash,
      name,
    })

    const errors = newUser.validateSync()
    if (errors) {
      saveLog('warn', 'POST', 'auth/register: invalid data', errors)
      return res.status(400).json(errors)
    }

    const userData = await newUser.save()
    if (!userData) {
      saveLog('warn', 'POST', 'auth/register: save issue')
      return res.status(400).json('Something wrong with saving user')
    }

    const defaultSettings = new SettingsModel({
      userId: userData._id,
    })
    defaultSettings.save()

    saveLog('info', 'POST', 'auth/register: register success', {
      userId: userData._id,
    })
    res.json({ message: 'success' })
  } catch (e) {
    console.log(e)
    saveLog('error', 'POST', 'auth/register: system error', { error: e })
    res.status(500).json(e)
  }
})

export default router
