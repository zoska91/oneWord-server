import dotenv from 'dotenv';

dotenv.config();

const config = {
  db: process.env.DB,
  saltRounds: 10,
};

export default config;
