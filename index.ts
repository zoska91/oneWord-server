import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import fileupload from 'express-fileupload';

import config from './config';

import authRouter from './routes/auth';
import settingRoute from './routes/settings';
import wordsRoute from './routes/words';
import chatRoute from './routes/chat';
import subscriptionRoute from './routes/subscription';

dbConnect().catch((err) => console.log(err));

async function dbConnect() {
  if (!config.db) return console.log('No database URL provided');
  await mongoose.connect(config.db);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var port = process.env.PORT || 3000;
const app = express();

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
      mongoUrl: config.db,
    }),
  })
);

app.use('/api/auth', authRouter);
app.use('/api/settings', settingRoute);
app.use('/api/words', wordsRoute);
app.use('/api/chat', chatRoute);
app.use('/api/subscription', subscriptionRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
