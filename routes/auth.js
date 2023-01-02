/**
 * @openapi
 * /login:
 *   post:
 *     description: Login
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 * /users:
 *  get:
 *    description: get all users
 *    response:
 *      200:
 *        description: great
 *
 */

import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'

import { UserModel } from '../models/user.js'
import config from '../config.js'
import { SettingsModel } from '../models/settings.js'

const router = express.Router()

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const data = await UserModel.findOne({ username })
      console.log(data)
      if (!data) return cb(null, false, { message: `nie ma Cię w bazie` })

      bcrypt.compare(password, data.password, (err, result) => {
        if (result) {
          return cb(null, data)
        } else {
          return cb(null, false, {
            message: 'Incorrect username or password.',
          })
        }
      })
    } catch (err) {
      if (err) {
        console.log(err)
        return cb(err)
      }
    }
  })
)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user)
  })
})

router.get('/user', async (req, res) => {
  if (req.user) res.json({ user: req.user })
  else res.status(401).json({ message: 'no logged user' })
})

router.post('/login', passport.authenticate('local', {}), (req, res) => {
  res.json({ message: 'success' })
})

router.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.json({ message: 'logout success' })
  })
})

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
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
