import dotenv from 'dotenv';

dotenv.config();

const config = {
  db: process.env.DB,
  saltRounds: 10,
  secret: process.env.SECRET
};

export default config;
