import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'email jest wymagany'] },
  password: { type: String, required: [true, 'hasło jest wymagane'] },
  isAi: { type: Number, default: 0 },
  salt: String,
})

export const UserModel = mongoose.model('User', userSchema)
