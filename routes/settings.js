import express from 'express'
import { SettingsModel } from '../models/settings.js'
import jwt from 'jsonwebtoken'
import config from '../config.js'
import { saveLog } from '../logger.js'

const router = express.Router()

router.get('/user-settings', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      saveLog(
        'warn',
        'GET',
        'settings/user-settings',
        'no token',
        req.headers.authorization
      )
      return res.status(401).json({ message: 'no logged user' })
    }

    const { id: userId } = jwt.verify(token, config.secret)
    const settings = await SettingsModel.findOne({ userId })

    res.json(settings)
  } catch (e) {
    console.log(e)
    saveLog('error', 'GET', 'settings/user-settings', 'system error', {
      error: e,
    })
    res.status(500).json({ message: 'something went wrong' })
  }
})

router.put('/user-settings', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      saveLog(
        'warn',
        'PUT',
        'settings/user-settings',
        'no token',
        req.headers.authorization
      )
      return res.status(401).json({ message: 'no logged user' })
    }

    const { id: userId } = jwt.verify(token, config.secret)

    await SettingsModel.findOneAndUpdate({ userId }, req.body)

    saveLog(
      'info',
      'PUT',
      'settings/user-settingss',
      'update settings success',
      { userId }
    )
    res.json({ message: 'Update success' })
  } catch (e) {
    console.log(e)
    saveLog('error', 'PUT', 'settings/user-settings', 'system error', {
      error: e,
    })
    res.status(500).json({ message: 'something went wrong' })
  }
})

export default router
