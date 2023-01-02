import mongoose from 'mongoose'

const wordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  basicWord: { type: String, required: [true, 'to pole jest wymagane'] },
  transWord: { type: String, required: [true, 'to pole jest wymagane'] },
  addLang: { type: String, default: 'en' },
  status: { type: Number, default: 0 },
  createdDate: { type: Date, default: new Date() },
  updatedDate: { type: Date },
})

export const WordModel = mongoose.model('Word', wordSchema)

//status
// 0 - new (to learn)
// 1 - today
// 2 - done
