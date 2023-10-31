import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mongoose from 'mongoose'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import cors from 'cors'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import config from './config.js'
import { swaggerConfig } from './swagger.config.js'

import authRouter from './routes/auth.js'
import settingRoute from './routes/settings.js'
import wordsRoute from './routes/words.js'

dbConnect().catch((err) => console.log(err))

async function dbConnect() {
  await mongoose.connect(config.db)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const specs = swaggerJSDoc(swaggerConfig)

app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use(cors())
app.use(
  session({
    secret: 'top top',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: config.db,
    }),
  })
)

app.use('/api/auth', authRouter)
app.use('/api/settings', settingRoute)
app.use('/api/words', wordsRoute)

export default app
