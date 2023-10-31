import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { UserModel } from '../models/user.js'
import config from '../config.js'
import { SettingsModel } from '../models/settings.js'

const router = express.Router()

router.get('/user', async (req, res) => {
  if (!req.headers?.authorization)
    return res.status(401).json({ message: 'no logged user' })

  const token = await req.headers.authorization.split(' ')[1]
  if (token === 'undefined')
    return res.status(401).json({ message: 'no logged user' })

  const { username, id, name } = jwt.verify(token, 'abfewvsdvarebr')

  if (username && id) res.json({ username, id, name })
  else res.status(401).json({ message: 'no logged user' })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const data = await UserModel.findOne({ username })
    if (!data) return res.status(404).send({ message: 'Email not found' })

    bcrypt.compare(password, data.password, (err, result) => {
      if (result) {
        var token = jwt.sign(
          { id: data._id, username: data.username, name: data.name },
          'abfewvsdvarebr'
        )

        res.status(200).send({
          message: 'Login Successful',
          email: result.email,
          token,
        })
      } else {
        return res.status(400).send({
          message: 'Incorrect username or password.',
        })
      }
    })
  } catch (err) {
    if (err) {
      console.log(err)
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

    if (findUser)
      return res
        .status(400)
        .json({ message: 'this user is already in the database' })

    const hash = await bcrypt.hash(password, config.saltRounds)

    if (!hash)
      return res.status(500).json('Something is wrong with your password')

    const newUser = new UserModel({
      username,
      password: hash,
      name,
    })

    const errors = newUser.validateSync()
    if (errors) return res.status(400).json(errors)

    const userData = await newUser.save()
    if (!userData)
      return res.status(400).json('Something wrong with saving user')

    const defaultSettings = new SettingsModel({
      userId: userData._id,
    })
    defaultSettings.save()

    res.json({ message: 'success' })
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
})

export default router
