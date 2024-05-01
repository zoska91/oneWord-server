import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { UserModel } from '../models/user.js'
import config from '../config.js'
import { SettingsModel } from '../models/settings.js'
import { saveLog } from '../logger.js'
import { getUser } from '../utils/getUser.js'

const router = express.Router()

router.get('/message', async (req, res) => {
  const user = await getUser(req.headers.authorization)
  const { username, id, isAi } = user

  if (typeof user === 'number') {
    saveLog('warn', 'GET', 'chat/message', 'no user', user)
    res.status(user).json()
    return
  }
})
