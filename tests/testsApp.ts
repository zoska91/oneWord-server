import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import fileupload from 'express-fileupload';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authRouter from '../routes/auth';
import settingRoute from '../routes/settings';
import wordsRoute from '../routes/words';
import chatRoute from '../routes/chat';
import subscriptionRoute from '../routes/subscription';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const mongoServer = await MongoMemoryServer.create();
const dbUri = mongoServer.getUri();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: '*',
    exposedHeaders: ['x-conversation-id'],
  })
);
app.use(fileupload());
app.use(
  session({
    secret: 'top top',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: dbUri,
    }),
  })
);

app.use('/api/auth', authRouter);
app.use('/api/settings', settingRoute);
app.use('/api/words', wordsRoute);
app.use('/api/chat', chatRoute);
app.use('/api/subscription', subscriptionRoute);

export default app;
