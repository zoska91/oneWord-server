import express from 'express'
import { SettingsModel } from '../models/settings.js'

const router = express.Router()

router.get('/user-settings', async (req, res) => {
  try {
    if (!req.user) res.status(401).json({ message: 'no logged user' })

    const userId = req.user._id.valueOf()
    const settings = await SettingsModel.find({ userId })

    res.json(settings)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'something went wrong' })
  }
})

router.put('/user-settings', async (req, res) => {
  try {
    const userId = req.user._id.valueOf()

    await SettingsModel.findOneAndUpdate({ userId }, req.body)
    res.json({ message: 'Update success' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'something went wrong' })
  }
})

export default router
